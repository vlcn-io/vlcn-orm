import writer from './writer';
import { nullthrows } from '@strut/utils';
import { DeleteChangeset } from './Changeset.js';
import { IModel } from '@aphro/model-runtime-ts';
import { SID_of } from '@strut/sid';
import { Context } from '@aphro/context-runtime-ts';
import { Transaction } from './ChangesetExecutor.js';

export default class Persistor {
  constructor(private context: Context) {}

  private write(
    collectedDeletes: DeleteChangeset<IModel, Object>[],
    collectedCreatesOrUpdates: Map<SID_of<IModel>, IModel>,
  ) {
    return Promise.all([
      writer.deleteBatch(this.context, collectedDeletes),
      writer.upsertBatch(this.context, collectedCreatesOrUpdates.values()),
    ]);
  }

  // TODO: all of this batching is likely premature optmization
  persist(tx: Transaction) {
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
