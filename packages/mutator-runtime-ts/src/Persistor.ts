import writer from './writer.js';
import { nullthrows } from '@strut/utils';
import { SID_of } from '@strut/sid';
import { Context, IModel, DeleteChangeset, Transaction } from '@aphro/context-runtime-ts';
import tracer from './trace.js';

export default class Persistor {
  constructor(private context: Context) {}

  private write(
    collectedDeletes: DeleteChangeset<IModel, Object>[],
    collectedCreatesOrUpdates: Map<SID_of<IModel>, IModel>,
  ): Promise<[void, void]> {
    // TODO: start trnsaction
    // TODO: commit transaction
    return tracer.genStartActiveSpan('Persistor.write', async span => {
      try {
        // we need to disaggregate by db here.
        // so we can do tx per db.
        // await writer.startTransaction();
        const ret = await Promise.all([
          writer.deleteBatch(this.context, collectedDeletes),
          writer.upsertBatch(this.context, collectedCreatesOrUpdates.values()),
        ]);
        // await writer.commitTransaction();
        return ret;
      } catch (e) {
        // await writer.rollbackTransaction();
        throw e;
      }
    });
  }

  // TODO: all of this batching is likely premature optmization
  async persist(tx: Omit<Transaction, 'persistHandle'>): Promise<[void, void]> {
    const collectedDeletes: DeleteChangeset<IModel, Object>[] = [];
    const collectedCreatesOrUpdates: Map<SID_of<IModel>, IModel> = new Map();
    tx.changes.forEach((value, key) => {
      if (value.spec.storage.type === 'ephemeral') {
        return;
      }
      if (value.type === 'delete') {
        collectedDeletes.push(value);
        return;
      }

      collectedCreatesOrUpdates.set(key, nullthrows(tx.nodes.get(key)));
    });

    return await this.write(collectedDeletes, collectedCreatesOrUpdates);
  }
}
