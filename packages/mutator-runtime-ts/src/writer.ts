import { Context, INode, DeleteChangeset } from '@aphro/context-runtime-ts';
import { StorageConfig } from '@aphro/schema-api';
import sqlWriter from './sql/sqlWriter.js';

export default {
  // TODO: the common case is probably updating a single node
  // for a single engine. Should we optimize for that path instead?
  async upsertBatch(ctx: Context, nodes: IterableIterator<INode<Object>>): Promise<void> {
    await Promise.all(createAwaitables(ctx, nodes, sqlWriter.upsertGroup));
  },

  async deleteBatch(
    ctx: Context,
    deletes: DeleteChangeset<INode<Object>, Object>[],
  ): Promise<void> {
    await Promise.all(
      createAwaitables(
        ctx,
        (function* () {
          for (const cs of deletes) {
            yield cs.model;
          }
        })(),
        sqlWriter.deleteGroup,
      ),
    );
  },
};

function createAwaitables(
  ctx: Context,
  nodes: IterableIterator<INode<Object>>,
  sqlOp: (ctx: Context, nodes: INode[]) => Promise<void>,
): Promise<void>[] {
  const byEngineDbTable: Map<string, INode<Object>[]> = new Map();
  for (const node of nodes) {
    const key = createKey(node.spec.storage);
    let grouping: INode[] | undefined = byEngineDbTable.get(key);
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
    }
  }

  return writes;
}

function createKey(persistConfig: StorageConfig): string {
  return persistConfig.engine + '-' + persistConfig.db + '-' + persistConfig.tablish;
}
