import { Context, IModel, DeleteChangeset, ResolvedDB } from '@aphro/context-runtime-ts';
import { RemoveNameField, StorageConfig } from '@aphro/schema-api';
import { assertUnreachable } from '@strut/utils';
import memoryWriter from './memoryWriter.js';
import sqlWriter from './sql/sqlWriter.js';

export default {
  // TODO: the common case is probably updating a single node
  // for a single engine. Should we optimize for that path instead?
  upsertBatch(db: ResolvedDB, nodes: IterableIterator<IModel<Object>>): Promise<any> {
    return Promise.all(
      createAwaitables(db, nodes, sqlWriter.upsertGroup, memoryWriter.upsertGroup),
    );
  },

  deleteBatch(db: ResolvedDB, deletes: DeleteChangeset<IModel<Object>, Object>[]): Promise<any> {
    return Promise.all(
      createAwaitables(
        db,
        (function* () {
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

// Before getting here we're already grouped by engine & db
// grouping by table given we can't
// insert into many tables in a single insert statement
function createAwaitables(
  db: ResolvedDB,
  nodes: IterableIterator<IModel<Object>>,
  sqlOp: (db: ResolvedDB, nodes: IModel[]) => Promise<void>,
  memoryOp: (db: ResolvedDB, nodes: IModel[]) => Promise<void>,
): Promise<void>[] {
  const byTable: Map<string, IModel<Object>[]> = new Map();
  for (const node of nodes) {
    const key = createKey(node.spec.storage);
    let grouping: IModel[] | undefined = byTable.get(key);
    if (grouping == null) {
      grouping = [];
      byTable.set(key, grouping);
    }
    grouping.push(node);
  }

  const writes: Promise<void>[] = [];
  for (const [key, group] of byTable) {
    const type = group[0].spec.storage.type;
    switch (type) {
      case 'sql':
        writes.push(sqlOp(db, group));
        break;
      case 'memory':
        writes.push(memoryOp(db, group));
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

function createKey(persistConfig: RemoveNameField<StorageConfig>): string {
  return persistConfig.tablish;
}
