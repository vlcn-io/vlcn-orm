import { IModel } from '@aphro/model-runtime-ts';
import { Changeset } from './Changeset';
import changesetToSQL from './sql/changesetToSQL.js';
import { __internalConfig } from '@aphro/context-runtime-ts';

type Query = {
  queryString: string;
  bindings: any[];
};

// TODO should we collapse multiple mutations of the same model into a single CS?
// The collection could be hetorogonous hence the any, any
export default function changesetExecutor(changesets: Changeset<any, any>[]) {
  // TODO Go thru changesets
  // Group into batches that could be batched based on storage being hit
  // We could batch here or in the db resolver on the next tick
  // How shall we return results back out to our users?
  // Supply `return` to changeset creation?
  // return tuples?
  return {
    async exec(): Promise<(IModel<any> | null)[]> {
      const queries = changesets.map(cs => getQuery(cs));
      const results = await Promise.all(
        queries.map(query =>
          __internalConfig.resolver
            // TODO: rm type, add db!
            .type(this.spec.storage.type)
            .engine(this.spec.storage.engine)
            .db(this.spec.storage.db)
            .exec(query.queryString, query.bindings),
        ),
      );

      return results;
    },
  };
}

function getQuery<M extends IModel<D>, D extends Object>(cs: Changeset<M, D>): Query {
  switch (cs.spec.storage.type) {
    case 'sql':
      return changesetToSQL(this.spec, cs);
  }
}

/*
// Given changesets,
// Either
// 1. Create the nodes
// 2. Update the nodes
// 3. Delete the nodes
// Combo of 1-3
//
// And depending no node definitions...
// -> update via yjs
// -> update node directly
// ^-- the above would happen via the node's merge method(s)
//
// Does a changeset executor do much of anything?
// 1 -> collapse changesets in the batch
// 2 -> call _merge or _create or delete
//
// Changesets shouldn't create log events...
// those should come from the merging into the node now since node
// represent stable source of truth after replication reconciliation
//
// If yjs has undo/redo capability....
// should we retain that for ourselves too?
// the reason to retain it for ourselves would be to handle
// undo/redo for non-replicated models

import cache from "../cache";
import { Context } from "context";
import { Changeset } from "./Changeset";
import { ID_of } from "../ID";
import { Node } from "../Node";
import { Task } from "../NotifyQueue";
import { NodeSchema, RequiredNodeData } from "../Schema";
import ImmutableNodeMap, { MutableNodeMap } from "../NodeMap";
import { CommitOptions } from "./commit";

export type CombinedChangesets = Map<
  ID_of<Node<RequiredNodeData>>,
  Changeset<NodeSchema>
>;
export type Transaction = {
  readonly changes: Map<ID_of<Node<RequiredNodeData>>, Changeset<NodeSchema>>;
  readonly nodes: ImmutableNodeMap;
  readonly options: CommitOptions;
};

export class ChangesetExecutor {
  constructor(
    private context: Context,
    private changesets: Changeset<NodeSchema>[],
    private options: CommitOptions = {}
  ) {}

  // Ideally we return the transaction list...
  // to replicate to logs.
  execute(): Transaction {
    // Merge multiple updates to the same object into a single changeset
    const combined = this._combineChangesets();
    this.removeNoops(combined);
    const [transaction, notifications] = this.apply(combined);
    this.context.commitLog.push(transaction);

    // TODO: Should we do this tick or next tick?
    setTimeout(() => {
      for (const n of notifications) {
        n();
      }
    }, 0);

    return transaction;
  }

  private removeNoops(changesets: CombinedChangesets) {
    for (const [id, changeset] of changesets) {
      if (changeset.type === "update") {
        if (changeset.node._isNoop(changeset.updates)) {
          changesets.delete(id);
        }
      }
    }
  }

  private apply(changesets: CombinedChangesets): [Transaction, Set<Task>] {
    const nodes = new MutableNodeMap();
    const notifications: Set<Task> = new Set();
    for (const [id, cs] of changesets) {
      const [model, notifBatch] = this.processChanges(cs);
      nodes.set(id, model);
      for (const notif of notifBatch) {
        notifications.add(notif);
      }
    }
    return [
      {
        changes: changesets,
        nodes,
        options: this.options,
      },
      notifications,
    ];
  }

  private processChanges(
    changeset: Changeset<NodeSchema>
  ): [Node<RequiredNodeData> | null, Set<() => void>] {
    switch (changeset.type) {
      case "create": {
        const ret = changeset.definition._createFromData(
          this.context,
          changeset.updates as any
        );
        cache.set(ret._id, ret);
        const [_, notifs] = ret._merge(changeset.updates);
        return [ret, notifs];
      }
      case "update": {
        const [_, notifs] = changeset.node._merge(changeset.updates);
        return [changeset.node, notifs];
      }
      case "delete": {
        cache.remove(changeset._id);
        const node = changeset.node;
        // TODO: delete notifications?
        node._destroy();
        return [null, new Set()];
      }
    }
  }

  _combineChangesets(): CombinedChangesets {
    const merged: CombinedChangesets = new Map();
    for (const changeset of this.changesets) {
      const existing = merged.get(changeset._id);

      if (!existing) {
        merged.set(changeset._id, changeset);
        continue;
      }

      if (existing.type === "delete") {
        // No need to merge. Deleted is deleted.
        continue;
      }

      if (changeset.type === "delete") {
        // Replace the existing one with the delete.
        merged.set(changeset._id, changeset);
        continue;
      }

      if (changeset.type === "create") {
        throw new Error("Creating the same node twice");
      }

      if (existing.type === "create") {
        throw new Error("Updating a nod ebefore it is created");
      }

      merged.set(changeset._id, {
        type: "update",
        updates: {
          ...existing.updates,
          ...changeset.updates,
        },
        node: changeset.node,
        _id: changeset._id,
        _parentDocId: changeset._parentDocId,
      });
    }

    return merged;
  }

  // Maybe we should also ignore changesets that don't actually change anything?
  // private removeNoops(changesets: MergedChangesets) {
  //   for (const [model, changes] of changesets) {
  //     if (changes !== undefined && model.isNoop(changes)) {
  //       changesets.delete(model);
  //     }
  //   }
  // }
}

// private apply(changesets: MergedChangesets): [Transaction, Set<Task>] {
//   // iterate changesets
//   // merge into each model
//   // get resulting notifications and prior states from model
//   // return

//   // TODO: we don't need to keep prior states
//   // since the transaction before us is the prior state. Well...
//   // the transaction before us that contains our model!
//   // Hard to find that.
//   const priorStates = new ModelMap<IModel<any>, Partial<any>>();
//   const notifications: Set<Task> = new Set();
//   for (const [model, changes] of changesets) {
//     const mergeResult = model._merge(changes);
//     if (mergeResult == null) {
//       // TODO: we need a test for this merge behavior!
//       // we need tests for all the things!
//       continue;
//     }
//     const [lastData, currentNotifications] = mergeResult;
//     for (const task of currentNotifications) {
//       notifications.add(task);
//     }
//     priorStates.set(model, lastData);
//   }

//   return [
//     {
//       priorStates,
//       changesets,
//     },
//     notifications,
//   ];
// }

*/
