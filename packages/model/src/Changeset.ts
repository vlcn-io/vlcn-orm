import { notEmpty } from "@strut/utils";
import Model, { IModel } from "./Model.js";
import ModelMap from "./ModelMap.js";
import type { Task } from "./NotifyQueue.js";
import TransactionLog from "./TransactionLog.js";

export type Changeset<M extends IModel<T>, T> =
  | CreateChangeset<M, T>
  | UpdateChangeset<M, T>
  | DeleteChangeset<M, T>;

export type CreateChangeset<M extends IModel<T>, T> = {
  type: "create";
  model: M;
  updates: Partial<T>;
};

type UpdateChangeset<M extends IModel<T>, T> = {
  type: "update";
  model: M;
  updates: Partial<T>;
};

export type DeleteChangeset<M extends IModel<T>, T> = {
  type: "delete";
  model: M;
  updates: undefined;
};

export function changeset<M extends IModel<T>, T>(
  model: M,
  updates: T
): Changeset<M, T> {
  return {
    type: "update",
    model,
    updates,
  };
}

export function createChangeset<M extends IModel<T>, T>(
  model: M,
  updates: T
): CreateChangeset<M, T> {
  return {
    type: "create",
    model,
    updates,
  };
}

export type MergedChangesets = ModelMap<IModel<any>, Partial<any> | undefined>;

export type Transaction = {
  priorStates: ModelMap<IModel<any>, Partial<any>>;
  changesets: ModelMap<IModel<any>, Partial<any> | undefined>;
};

// Clients will call mutation methods on the model.
// Those methods will return changesets.
// Clients will then commit changesets when ready.
class ChangesetExecutor {
  constructor(
    private changesets: Changeset<Model<any>, any>[],
    private logs: TransactionLog[]
  ) {}

  execute() {
    const merged = this.mergeChangesets();
    this.removeNoops(merged);
    const [transaction, notifications] = this.apply(merged);
    this.logs.forEach((l) => l.push(transaction));

    // TODO: place transaction onto transaction log

    // fire model notifications
    // Should we do this tick or next tick?
    setTimeout(() => {
      for (const n of notifications) {
        n();
      }
    }, 0);

    // DBs, undo/redo, can read from tx log to do their magic.
  }

  // For changesets that target the same object, merge their properties into
  // a single thing. Later mutations override earlier mutations.
  // Or should we throw if the same field is set twice?
  private mergeChangesets(): MergedChangesets {
    const merged: ModelMap<Model<any>, Partial<any>> = new ModelMap();
    for (const changeset of this.changesets) {
      const existing = changeset.model && merged.get(changeset.model);
      let update;
      if (existing != null) {
        if (changeset.updates === undefined) {
          // a delete should nuke any modifications coming through
          update = undefined;
        } else {
          update = {
            ...existing,
            ...changeset.updates,
          };
        }
      } else {
        update = changeset.updates;
      }
      changeset.model && merged.set(changeset.model, update);
    }

    return merged;
  }

  private removeNoops(changesets: MergedChangesets) {
    for (const [model, changes] of changesets) {
      if (changes !== undefined && model.isNoop(changes)) {
        changesets.delete(model);
      }
    }
  }

  private apply(changesets: MergedChangesets): [Transaction, Set<Task>] {
    // iterate changesets
    // merge into each model
    // get resulting notifications and prior states from model
    // return

    // TODO: we don't need to keep prior states
    // since the transaction before us is the prior state. Well...
    // the transaction before us that contains our model!
    // Hard to find that.
    const priorStates = new ModelMap<IModel<any>, Partial<any>>();
    const notifications: Set<Task> = new Set();
    for (const [model, changes] of changesets) {
      const mergeResult = model._merge(changes);
      if (mergeResult == null) {
        // TODO: we need a test for this merge behavior!
        // we need tests for all the things!
        continue;
      }
      const [lastData, currentNotifications] = mergeResult;
      for (const task of currentNotifications) {
        notifications.add(task);
      }
      priorStates.set(model, lastData);
    }

    return [
      {
        priorStates,
        changesets,
      },
      notifications,
    ];
  }
}

// Do we commite changesets for completely new objects?
// There's nothing to commit there, right?
export function commit(
  changeset:
    | Changeset<Model<any, any>, any>
    | (Changeset<Model<any, any>, any> | null)[]
    | null,
  log: TransactionLog | TransactionLog[]
) {
  if (changeset == null) {
    return;
  }
  const changesetArray = Array.isArray(changeset)
    ? changeset.filter(notEmpty)
    : [changeset];
  if (changesetArray.length === 0) {
    return;
  }
  new ChangesetExecutor(
    changesetArray,
    !Array.isArray(log) ? [log] : log
  ).execute();
}
