import sql, { SQLQuery } from '@databases/sql';

// Returns primary keys of changed items, and their clocks, wrt the provided clock.
export function deltaQuery(table: string, vectorClock: { [key: string]: number }): SQLQuery {
  return sql`SELECT ${sql.ident(
    tableName(table),
    idName(table),
  )} as id, json_group_object("vc_peerId", "vc_version") as clock FROM ${sql.ident(
    tableName(table),
  )} LEFT JOIN json_each(${JSON.stringify(vectorClock)}) as provided_clock ON
  provided_clock."key" = ${(sql.ident(tableName(table)), 'vc_peerId')} AND
  provided_clock."value" = ${sql.ident(tableName(table), 'vc_version')}
  GROUP BY ${sql.ident(tableName(table), idName(table))}`;
}

export function currentClockQuery(table: string): SQLQuery {
  // TODO: need to use the forked version of sqlite3 to fix this cast:
  // https://github.com/TryGhost/node-sqlite3/issues/922
  // fork: https://github.com/juanrgm/node-sqlite3/tree/int64-support
  return sql`SELECT cast("vc_peerId" as varchar) as peerId, max("vc_version") as version FROM ${sql.ident(
    tableName(table),
  )}
  GROUP BY "vc_peerId"`;
}

const patchOrder = [
  'id',
  'listId',
  'listId_v',
  'text',
  'text_v',
  'completed',
  'completed_v',
  'crr_cl',
  'vector_clock',
] as const;
export function patchQuery(
  table: string,
  rows: { [k in typeof patchOrder[number]]: any }[],
): SQLQuery {
  const mappedRows = rows.map(
    r => sql`(${sql.join(patchOrder.map(key => sql.value(r[key] === undefined ? null : r[key])))})`,
  );
  return sql`INSERT INTO ${sql.ident(
    patchTableName(table),
  )} ("id", "listId", "listId_v", "text", "text_v", "completed", "completed_v", "crr_cl", "vector_clock") VALUES ${sql.join(
    mappedRows,
    ', ',
  )}`;
}

function tableName(table: string) {
  return table + '_vector_clocks';
}

function idName(table: string) {
  return 'vc_' + table + 'Id';
}

function patchTableName(table: string) {
  return table + '_patch';
}
