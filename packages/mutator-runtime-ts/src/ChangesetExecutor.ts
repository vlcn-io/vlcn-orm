import {
  Context,
  Changeset,
  MutableHeteroModelMap,
  Transaction,
  IModel,
  UpdateChangeset,
} from '@aphro/context-runtime-ts';
import { SID_of } from '@strut/sid';
import { Task } from './NotifyQueue.js';
import Persistor from './Persistor.js';

export type CombinedChangesets = Map<SID_of<IModel>, Changeset<IModel>>;

export class ChangesetExecutor {
  constructor(
    private ctx: Context,
    private changesets: readonly Changeset<IModel>[], // private options: CommitOptions = {},
  ) {}

  // Ideally we return the transaction list...
  // to replicate to logs.
  execute(): Transaction {
    // Merge multiple updates to the same object into a single changeset
    const combined = this._combineChangesets();
    this.removeNoops(combined);
    const [transaction, notifications] = this.apply(combined);

    // TODO: Should we do this tick or next tick?
    setTimeout(() => {
      for (const n of notifications) {
        n();
      }
    }, 0);

    const ret = {
      ...transaction,
      persistHandle: new Persistor(this.ctx).persist(transaction),
    };

    this.ctx.commitLog.push(ret);

    return ret;
  }

  private removeNoops(changesets: CombinedChangesets) {
    for (const [id, changeset] of changesets) {
      if (changeset.type === 'update') {
        if (changeset.model._isNoop(changeset.updates)) {
          changesets.delete(id);
        }
      }
    }
  }

  private apply(changesets: CombinedChangesets): [Omit<Transaction, 'persistHandle'>, Set<Task>] {
    const nodes = new MutableHeteroModelMap();
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
        // options: this.options,
      },
      notifications,
    ];
  }

  private processChanges(changeset: Changeset<IModel>): [IModel | null, Set<() => void>] {
    switch (changeset.type) {
      case 'create': {
        const ret = changeset.spec.createFrom(this.ctx, changeset.updates as any, false);
        const [_, notifs] = ret._merge(changeset.updates);
        return [ret, notifs];
      }
      case 'update': {
        const [_, notifs] = changeset.model._merge(changeset.updates);
        return [changeset.model, notifs];
      }
      case 'delete': {
        this.ctx.cache.remove(
          changeset.id,
          changeset.model.spec.storage.db,
          changeset.model.spec.storage.tablish,
        );
        const node = changeset.model;
        // TODO: delete notifications?
        node.destroy();
        return [null, new Set()];
      }
    }
  }

  _combineChangesets(): CombinedChangesets {
    const merged: CombinedChangesets = new Map();
    for (const changeset of this.changesets) {
      const existing = merged.get(changeset.id);

      if (!existing) {
        merged.set(changeset.id, changeset);
        continue;
      }

      if (existing.type === 'delete') {
        // No need to merge. Deleted is deleted.
        continue;
      }

      if (changeset.type === 'delete') {
        // Replace the existing one with the delete.
        merged.set(changeset.id, changeset);
        continue;
      }

      if (changeset.type === 'create') {
        throw new Error('Creating the same node twice');
      }

      if (existing.type === 'create') {
        throw new Error('Updating a nod ebefore it is created');
      }

      merged.set(changeset.id, {
        type: 'update',
        updates: {
          ...existing.updates,
          ...changeset.updates,
        },
        spec: changeset.model.spec,
        model: changeset.model,
        id: changeset.id,
      } as UpdateChangeset<any, any>);
    }

    return merged;
  }
}
