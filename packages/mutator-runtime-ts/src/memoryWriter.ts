import { Context, IModel, MemoryResolvedDB, ResolvedDB } from '@aphro/context-runtime-ts';

export default {
  async upsertGroup<T extends {}>(db: ResolvedDB, nodes: IModel<T>[]): Promise<void> {
    const first = nodes[0];
    const spec = first.spec;

    await (db as MemoryResolvedDB).write({
      type: 'write',
      op: 'upsert',
      models: nodes,
      tablish: spec.storage.tablish,
    });
  },

  async deleteGroup(db: ResolvedDB, nodes: IModel[]): Promise<void> {
    const first = nodes[0];
    const spec = first.spec;

    await (db as MemoryResolvedDB).write({
      type: 'write',
      op: 'delete',
      models: nodes,
      tablish: spec.storage.tablish,
    });
  },
};
