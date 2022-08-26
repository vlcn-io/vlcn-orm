import writer from './writer.js';
import { nullthrows } from '@strut/utils';
import { SID_of } from '@strut/sid';
import {
  Context,
  IModel,
  DeleteChangeset,
  Transaction,
  ResolvedDB,
} from '@aphro/context-runtime-ts';
import tracer from './trace.js';

type OpsByDB = Map<
  ResolvedDB,
  {
    deletes: DeleteChangeset<IModel, Object>[];
    createsOrUpdates: Map<SID_of<IModel>, IModel>;
  }
>;

export default class Persistor {
  constructor(private context: Context) {}

  private write(ops: OpsByDB): Promise<any> {
    const promises: Promise<any>[] = [];
    for (const [db, op] of ops.entries()) {
      promises.push(this.writeToDB(db, op.deletes, op.createsOrUpdates));
    }

    return Promise.all(promises);
  }

  private writeToDB(
    db: ResolvedDB,
    collectedDeletes: DeleteChangeset<IModel, Object>[],
    collectedCreatesOrUpdates: Map<SID_of<IModel>, IModel>,
  ) {
    // TODO: micro-optimization would be to consider how many rows
    // are written. Only 1 row? No tx needed.
    return tracer.genStartActiveSpan('Persistor.writeToDB', span => {
      return db.transact(db => {
        return Promise.all([
          writer.deleteBatch(db, collectedDeletes),
          writer.upsertBatch(db, collectedCreatesOrUpdates.values()),
        ]);
      });
    });
  }

  persist(tx: Omit<Transaction, 'persistHandle'>): Promise<any> {
    const opsByDb: OpsByDB = new Map();

    tx.changes.forEach((value, modelId) => {
      if (value.spec.storage.type === 'ephemeral') {
        return;
      }

      const db = this.context.dbResolver
        .engine(value.spec.storage.engine)
        .db(value.spec.storage.db);
      if (value.type === 'delete') {
        let existing = opsByDb.get(db);
        if (existing == null) {
          existing = {
            deletes: [],
            createsOrUpdates: new Map(),
          };
          opsByDb.set(db, existing);
        }
        existing.deletes.push(value);
        return;
      }

      let existing = opsByDb.get(db);
      if (existing == null) {
        existing = {
          deletes: [],
          createsOrUpdates: new Map(),
        };
        opsByDb.set(db, existing);
      }

      existing.createsOrUpdates.set(modelId, nullthrows(tx.nodes.get(modelId)));
    });

    return this.write(opsByDb);
  }
}
