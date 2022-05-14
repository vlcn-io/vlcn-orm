import { Context } from '@aphro/context-runtime-ts';
import { IModel } from '@aphro/model-runtime-ts';
import { StorageConfig } from '@aphro/schema-api';
import { DeleteChangeset } from './Changeset.js';
import sqlWriter from './sql/sqlWriter.js';

export default {
  // TODO: the common case is probably updating a single node
  // for a single engine. Should we optimize for that path instead?
  async upsertBatch(ctx: Context, nodes: IterableIterator<IModel<Object>>): Promise<void> {
    const byEngineDbTable: Map<string, IModel<Object>[]> = new Map();
    for (const node of nodes) {
      const key = createKey(node.spec.storage);
      let grouping: IModel<Object>[] | undefined = byEngineDbTable.get(key);
      if (grouping == null) {
        grouping = [];
        byEngineDbTable.set(key, grouping);
      }
      grouping.push(node);
    }

    const writes: Promise<void>[] = [];
    for (const [key, group] of byEngineDbTable) {
      const type = group[0].spec.storage.type;
      switch (type) {
        case 'sql':
          writes.push(sqlWriter.upsertGroup(ctx, group));
          break;
      }
    }

    await Promise.all(writes);
  },

  async deleteBatch(
    context: Context,
    deletes: DeleteChangeset<IModel<Object>, Object>[],
  ): Promise<void> {},
};

function createKey(persistConfig: StorageConfig): string {
  return persistConfig.engine + '-' + persistConfig.db + '-' + persistConfig.tablish;
}
