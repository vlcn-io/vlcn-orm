import { Context, DeleteChangeset, IModel } from '@aphro/context-runtime-ts';
import { sql } from '@aphro/sql-ts';

export default {
  // Precondition: already grouped by db & table
  // TODO: Should we grab all by DB so we can do many inserts in 1 statement to the
  // same db?
  async upsertGroup(ctx: Context, nodes: IModel[]): Promise<void> {
    const first = nodes[0];
    const spec = first.spec;
    const persist = spec.storage;

    const db = ctx.dbResolver.type(persist.type).engine(persist.engine).db(persist.db);

    // TODO: put field names into spec
    // TODO: get smarter on merge. right now replace is ok because we save the entire snapshot.
    // TODO: postgres unroll operation. @databases blog post
    const cols = Object.keys(first._d());
    const query = sql`INSERT OR REPLACE INTO ${'T'} (${'LC'}) VALUES ${'LR'}`(
      spec.storage.tablish,
      cols,
      nodes.map(n => Object.values(n._d())),
      // first.spec.primaryKey,
    ).toString(spec.storage.engine);

    // console.log(query);
    // console.log(nodes.map(n => Object.values(n._d())));
    await db.exec(
      query[0],
      query[1],
      // nodes.flatMap(n => Object.values(n._d())),
    );
  },

  // Precondition: already grouped by db & table
  async deleteGroup(ctx: Context, nodes: IModel[]): Promise<void> {
    const first = nodes[0];
    const spec = first.spec;
    const persist = spec.storage;

    const db = ctx.dbResolver.type(persist.type).engine(persist.engine).db(persist.db);

    const query = sql`DELETE FROM ${'T'} WHERE ${'C'} IN (${'La'})`(
      persist.tablish,
      spec.primaryKey,
      nodes.map(n => n.id),
    ).toString(spec.storage.engine);

    await db.exec(...query);
  },

  async createTables(): Promise<void> {},
};
