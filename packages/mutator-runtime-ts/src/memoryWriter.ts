import { Context, IModel, MemoryResolvedDB } from '@aphro/context-runtime-ts';

export default {
  async upsertGroup<T>(ctx: Context, nodes: IModel<T>[]): Promise<void> {
    const first = nodes[0];
    const spec = first.spec;
    const persist = spec.storage;
    const db = ctx.dbResolver.engine(persist.engine).db(persist.db) as MemoryResolvedDB;

    await db.query({
      type: 'write',
      op: 'upsert',
      models: nodes,
      tablish: spec.storage.tablish,
    });
  },

  async deleteGroup(ctx: Context, nodes: IModel[]): Promise<void> {
    const first = nodes[0];
    const spec = first.spec;
    const persist = spec.storage;
    const db = ctx.dbResolver.engine(persist.engine).db(persist.db) as MemoryResolvedDB;

    await db.query({
      type: 'write',
      op: 'delete',
      models: nodes,
      tablish: spec.storage.tablish,
    });
  },
};
