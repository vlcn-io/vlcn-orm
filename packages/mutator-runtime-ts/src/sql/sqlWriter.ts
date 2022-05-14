import { Context } from '@aphro/context-runtime-ts';
import { IModel } from '@aphro/model-runtime-ts';
import { DeleteChangeset } from '../Changeset';

export default {
  // Precondition: already grouped by db & table
  // TODO: Should we grab all by DB so we can do many inserts in 1 statement to the
  // same db?
  async upsertGroup(ctx: Context, nodes: IModel<Object>[]): Promise<void> {
    const first = nodes[0];
    const spec = first.spec;
    const persist = spec.storage;

    const db = ctx.dbResolver.type(persist.type).engine(persist.engine).db(persist.db);

    await db(persist.tablish)
      .insert(nodes.map(n => (n as any)._data))
      .onConflict(spec.primaryKey)
      .merge();
  },

  async deleteGroup(
    context: Context,
    delets: DeleteChangeset<IModel<Object>, Object>[],
  ): Promise<void> {},

  async createTables(): Promise<void> {},
};
