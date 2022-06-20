import writer from './writer.js';
import { nullthrows } from '@strut/utils';
import { SID_of } from '@strut/sid';
import { Context, IModel, DeleteChangeset, Transaction } from '@aphro/context-runtime-ts';

export default class Persistor {
  constructor(private context: Context) {}

  private write(
    collectedDeletes: DeleteChangeset<IModel, Object>[],
    collectedCreatesOrUpdates: Map<SID_of<IModel>, IModel>,
  ) {
    // TODO: start trnsaction
    // TODO: commit transaction
    return Promise.all([
      writer.deleteBatch(this.context, collectedDeletes),
      writer.upsertBatch(this.context, collectedCreatesOrUpdates.values()),
    ]);
  }

  // TODO: all of this batching is likely premature optmization
  persist(tx: Omit<Transaction, 'persistHandle'>) {
    const collectedDeletes: DeleteChangeset<IModel, Object>[] = [];
    const collectedCreatesOrUpdates: Map<SID_of<IModel>, IModel> = new Map();
    tx.changes.forEach((value, key) => {
      if (value.type === 'delete') {
        collectedDeletes.push(value);
        return;
      }

      collectedCreatesOrUpdates.set(key, nullthrows(tx.nodes.get(key)));
    });

    return this.write(collectedDeletes, collectedCreatesOrUpdates);
  }
}
