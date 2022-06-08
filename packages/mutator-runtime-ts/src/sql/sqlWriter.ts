import { Context, IModel } from '@aphro/context-runtime-ts';
import { formatters, sql } from '@aphro/sql-ts';

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

    // TODO: probs need to guarantee order via `spec`
    const cols = Object.keys(first._d());
    // TODO: we need access to fields in the spec in order to encode and handle complex fields.
    // or code-gen the appropriate encoding into `_d()`
    const rows = nodes.map(
      n =>
        sql`(${sql.join(
          Object.values(n._d()).map(v => sql.value(v === undefined ? null : v)),
          ', ',
        )})`,
    );
    const query = sql`INSERT OR REPLACE INTO ${sql.ident(spec.storage.tablish)} (${sql.join(
      cols.map(c => sql.ident(c)),
      ', ',
    )}) VALUES ${sql.join(rows, ', ')}`.format(formatters[spec.storage.engine]);

    // console.log(query);
    // console.log(nodes.map(n => Object.values(n._d())));
    await db.exec(
      query.text,
      query.values,
      // nodes.flatMap(n => Object.values(n._d())),
    );
  },

  // Precondition: already grouped by db & table
  async deleteGroup(ctx: Context, nodes: IModel[]): Promise<void> {
    const first = nodes[0];
    const spec = first.spec;
    const persist = spec.storage;

    const db = ctx.dbResolver.type(persist.type).engine(persist.engine).db(persist.db);

    const query = sql`DELETE FROM ${sql.ident(persist.tablish)} WHERE ${sql.ident(
      spec.primaryKey,
    )} IN (${sql.join(nodes.map(n => sql.value(n.id), ', '))})`.format(
      formatters[spec.storage.engine],
    );

    await db.exec(query.text, query.values);
  },

  async createTables(): Promise<void> {},
};
