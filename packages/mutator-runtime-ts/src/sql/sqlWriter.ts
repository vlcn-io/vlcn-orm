import { IModel, ResolvedDB, SQLResolvedDB } from '@aphro/context-runtime-ts';
import { encodeModelData } from '@aphro/model-runtime-ts';
import { sql, SQLQuery } from '@aphro/sql-ts';

function buildUpsertSql<T extends {}>(nodes: IModel<T>[]) {
  const first = nodes[0];
  const spec = first.spec;
  const persist = spec.storage;

  // TODO: put field names into spec
  // TODO: get smarter on merge. right now replace is ok because we save the entire snapshot.
  // TODO: postgres unroll operation. @databases blog post

  // TODO: probs need to guarantee order via `spec`
  const cols = Object.keys(first._d());
  const serializedNodes = nodes.map(n => encodeModelData(n._d(), spec.fields));
  // TODO: we need access to fields in the spec in order to encode and handle complex fields.
  // or code-gen the appropriate encoding into `_d()`
  const rows = serializedNodes.map(
    n =>
      sql`(${sql.join(
        Object.values(n).map(v => sql.value(v === undefined ? null : v)),
        ', ',
      )})`,
  );

  let query: SQLQuery;
  if (persist.engine === 'sqlite') {
    query = sql`INSERT OR REPLACE INTO ${sql.ident(spec.storage.tablish)} (${sql.join(
      cols.map(c => sql.ident(c)),
      ', ',
    )}) VALUES ${sql.join(rows, ', ')}`;
  } else {
    // TODO: batch insert via unnset -- https://www.atdatabases.org/docs/pg-bulk
    query = sql`INSERT INTO ${sql.ident(spec.storage.tablish)} (${sql.join(
      cols.map(c => sql.ident(c)),
      ', ',
    )}) VALUES ${sql.join(rows, ', ')} ON CONFLICT (${sql.ident(
      spec.type === 'node' ? spec.primaryKey : 'id1, id2',
    )}) DO UPDATE SET ${sql.join(
      cols.map(c => sql`${sql.ident(c)} = EXCLUDED.${sql.ident(c)}`),
      ', ',
    )}`;
  }

  return query;
}

export default {
  // Precondition: already grouped by db & table
  // TODO: Should we grab all by DB so we can do many inserts in 1 statement to the
  // same db?
  async upsertGroup<T extends {}>(db: ResolvedDB, nodes: IModel<T>[]): Promise<void> {
    const query = buildUpsertSql(nodes);
    // TODO: generic on `spec` so we know we're SQL here?
    // console.log(query);
    // console.log(nodes.map(n => Object.values(n._d())));
    await (db as SQLResolvedDB).write(
      query,
      // nodes.flatMap(n => Object.values(n._d())),
    );
  },

  buildUpsertSql,

  // Precondition: already grouped by db & table
  async deleteGroup(db: ResolvedDB, nodes: IModel[]): Promise<void> {
    const first = nodes[0];
    const spec = first.spec;
    const persist = spec.storage;

    let query: SQLQuery | null;
    if (spec.type === 'node') {
      query = sql`DELETE FROM ${sql.ident(persist.tablish)} WHERE ${sql.ident(
        spec.primaryKey,
      )} IN (${sql.join(
        nodes.map(n => sql.value(n.id)),
        ', ',
      )})`;
    } else {
      query = sql.__dangerous__rawValue(
        nodes
          .map(n => {
            const parts = n.id.split('|');
            return `DELETE FROM "${persist.tablish}" WHERE "id1" = '${parts[0]}' AND "id2" = '${parts[1]}'`;
          })
          .join(';'),
      );
      console.log(nodes);
    }

    await (db as SQLResolvedDB).write(query);
  },

  async createTables(): Promise<void> {},
};
