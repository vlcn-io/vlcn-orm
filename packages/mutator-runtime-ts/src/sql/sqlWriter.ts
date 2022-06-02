import { Context, DeleteChangeset, IModel } from '@aphro/context-runtime-ts';
import { sql } from '@aphro/sql-ts';

export default {
  // Precondition: already grouped by db & table
  // TODO: Should we grab all by DB so we can do many inserts in 1 statement to the
  // same db?
  async upsertGroup(ctx: Context, nodes: IModel<Object>[]): Promise<void> {
    const first = nodes[0];
    const spec = first.spec;
    const persist = spec.storage;

    const db = ctx.dbResolver.type(persist.type).engine(persist.engine).db(persist.db);

    // TODO: put field names into spec
    // TODO: get smarter on merge. right now this is ok because we save the entire snapshot.
    const cols = Object.keys(first._d());
    const query = sql`INSERT OR REPLACE INTO ${'T'} (${'LC'}) VALUES ${'LR'}`(
      first.spec.storage.tablish,
      cols,
      nodes.map(n => Object.values(n._d())),
      // first.spec.primaryKey,
    ).toString(first.spec.storage.engine);

    // console.log(query);
    // console.log(nodes.map(n => Object.values(n._d())));
    await db.exec(
      query[0],
      query[1],
      // nodes.flatMap(n => Object.values(n._d())),
    );
  },

  async deleteGroup(
    context: Context,
    delets: DeleteChangeset<IModel<Object>, Object>[],
  ): Promise<void> {},

  async createTables(): Promise<void> {},
};
