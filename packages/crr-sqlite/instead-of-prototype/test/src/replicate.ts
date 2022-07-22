import sql, { SQLQuery } from '@databases/sql';

// Returns primary keys of changed items, and their clocks, wrt the provided clock.
export function deltaQuery(table: string, vectorClock: { [key: string]: number }): SQLQuery {
  return sql`SELECT ${
    (sql.ident(tableName(table)), idName(table))
  }, json_group_object("vc_peerId", "vc_version") FROM ${sql.ident(
    tableName(table),
  )} LEFT JOIN json_each(${JSON.stringify(vectorClock)}) as provided_clock ON
  provided_clock."key" = ${(sql.ident(tableName(table)), 'vc_peerId')} AND
  provided_clock."value" = ${sql.ident(tableName(table), 'version')}
  GROUP BY ${sql.ident(tableName(table), idName(table))}`;
}

export function currentClockQuery(table: string): SQLQuery {
  return sql`SELECT "vc_peerId" as peerId, max("vc_version") as version FROM ${sql.ident(
    tableName(table),
  )}
  GROUP BY "vc_peerId"`;
}

function tableName(table: string) {
  return table + '_vector_clocks';
}

function idName(table: string) {
  return 'vc_' + table + 'Id';
}
