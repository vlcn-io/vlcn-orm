import { Context } from '@aphro/context-runtime-ts';
import { IModel } from '@aphro/model-runtime-ts';
import { DeleteChangeset } from '../Changeset.js';
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
    const cols = Object.keys(first._d());
    const query = sql`INSERT INTO ${'T'} (${'LC'}) VALUES (${'L?'}) ON CONFLICT(${'C'}) MERGE`(
      first.spec.storage.tablish,
      cols,
      cols.length,
      first.spec.primaryKey,
    ).toString(first.spec.storage.engine);

    await db.exec(
      query[0],
      nodes.map(n => Object.values(n._d())),
    );
  },

  async deleteGroup(
    context: Context,
    delets: DeleteChangeset<IModel<Object>, Object>[],
  ): Promise<void> {},

  async createTables(): Promise<void> {},
};
