import { Context, IModel, DeleteChangeset } from '@aphro/context-runtime-ts';
import { StorageConfig } from '@aphro/schema-api';
import { assertUnreachable } from '@strut/utils';
import memoryWriter from './memoryWriter.js';
import sqlWriter from './sql/sqlWriter.js';

export default {
  // TODO: the common case is probably updating a single node
  // for a single engine. Should we optimize for that path instead?
  async upsertBatch(ctx: Context, nodes: IterableIterator<IModel<Object>>): Promise<void> {
    await Promise.all(
      createAwaitables(ctx, nodes, sqlWriter.upsertGroup, memoryWriter.upsertGroup),
    );
  },

  async deleteBatch(
    ctx: Context,
    deletes: DeleteChangeset<IModel<Object>, Object>[],
  ): Promise<void> {
    await Promise.all(
      createAwaitables(
        ctx,
        (function*() {
          for (const cs of deletes) {
            yield cs.model;
          }
        })(),
        sqlWriter.deleteGroup,
        memoryWriter.deleteGroup,
      ),
    );
  },
};

function createAwaitables(
  ctx: Context,
  nodes: IterableIterator<IModel<Object>>,
  sqlOp: (ctx: Context, nodes: IModel[]) => Promise<void>,
  memoryOp: (ctx: Context, nodes: IModel[]) => Promise<void>,
): Promise<void>[] {
  const byEngineDbTable: Map<string, IModel<Object>[]> = new Map();
  for (const node of nodes) {
    const key = createKey(node.spec.storage);
    let grouping: IModel[] | undefined = byEngineDbTable.get(key);
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
        writes.push(sqlOp(ctx, group));
        break;
      case 'memory':
        writes.push(memoryOp(ctx, group));
        break;
      case 'ephemeral':
        throw new Error(`${type} should not write to any storage layers`);
        break;
      default:
        assertUnreachable(type);
    }
  }

  return writes;
}

function createKey(persistConfig: StorageConfig): string {
  return persistConfig.engine + '-' + persistConfig.db + '-' + persistConfig.tablish;
}
