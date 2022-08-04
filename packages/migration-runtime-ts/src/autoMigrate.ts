import { SQLResolvedDB } from '@aphro/context-runtime-ts';
import { sql, SQLQuery } from '@aphro/sql-ts';
import { nullthrows } from '@strut/utils';

export type CreateError = {
  cause: any;
  sql: string;
  schemaName: string;
  db: SQLResolvedDB;
};
type MigrationTask = Omit<CreateError, 'cause'>;

export type ColumnDef = {
  num: number | null;
  name: string;
  type: string | null;
  notnull: boolean;
};

export async function autoMigrate(migrationTasks: MigrationTask[]) {
  await Promise.all(migrationTasks.map(migrateOne));
}

// TODO: once you add index support you need to add index migration support.
// How will / should we detect dropped indices?
// Well we can find them via `where type = index and name = table name`
async function migrateOne(task: MigrationTask) {
  const newSql = task.sql.replaceAll('\n', '');
  const db = task.db;

  const tableName = extractTableName(newSql);
  const oldSql = (await getOldSql(db, tableName)).replaceAll('\n', '');
  const oldColumnDefs = extractColumnDefs(oldSql);
  const newColumnDefs = extractColumnDefs(newSql);

  const removedColumns = findRemovedColumns(oldColumnDefs, newColumnDefs);
  const addedColumns = findAddedColumns(oldColumnDefs, newColumnDefs);
  const modifiedColumns = findAlteredColumns(oldColumnDefs, newColumnDefs);

  const alterTableStatements = [
    ...removeStatements(removedColumns),
    ...addStatements(addedColumns),
    ...modifyStatements(modifiedColumns),
  ];

  await Promise.all(alterTableStatements.map(stmt => db.query(stmt)));
}

export function extractTableName(sql: string): string {
  const match = sql.match(/.*CREATE TABLE\s+"(.*?)"\s+.*/);
  if (match == null) {
    throw new Error('could not extract a table name from ' + sql);
  }
  return match[1];
}

export async function getOldSql(db: SQLResolvedDB, tableName: string): Promise<string> {
  // Note -- `sqlite_schema` is the proper name but is not accessible in some environments
  // whereas `sqlite_master` is. I wonder if the opposite is ever true.
  const rows = await db.query(
    sql`SELECT sql FROM main.sqlite_master WHERE name = ${tableName} AND type = 'table'`,
  );
  if (rows.length < 1) {
    throw new Error('Could not find the old schema for ' + tableName + ' in the provided database');
  }
  if (rows.length > 1) {
    throw new Error(
      'Unexpected number of old schemas returned by the database for table ' + tableName,
    );
  }

  return rows[0].sql;
}

// We do not use a pragma for this given we don't have a created table for the _new_ sql
// pragmas also do not include original comment text on a column which is where we place column numbers.
// The below assumes that Aphrodite is managing the table schemas.
// If someone is manually mucking with them after Aphrodite generates them...
// idk.. seems like that is really bad and would break all sorts of assumptions.
export function extractColumnDefs(sql: string): ColumnDef[] {
  const match = sql.match(/.*CREATE TABLE\s+".*?"\s+\((.*)\)/);
  if (match == null) {
    throw new Error(
      'could not extract column definitions from the sql create table clause: ' + sql,
    );
  }

  return match[1]
    .split(',')
    .map(c => c.trim())
    .map(c => {
      const match = c.match(
        /"(?<name>.*?)"\s+(?<type>[A-z]+(?<len>\([0-9]+\))?)\s+(?<nonnull>NOT NULL)?\s*(\/\*(?<meta>.*)\*\/)?/,
      );
      const meta = (match?.groups?.meta || '').trim();
      const maybeNum = new URLSearchParams(meta).get('n');

      if (match?.groups?.name == null) {
        // check if it is a constraint
        // if so, it is not a column def and we can safely return null.
        // TODO: well.. we should return constraint defs too because they could change and require migration
        const upcase = c.toUpperCase();
        if (
          upcase.startsWith('CONSTRAINT') ||
          upcase.startsWith('PRIMARY KEY') ||
          upcase.startsWith('UNIQUE') ||
          upcase.startsWith('CHECK') ||
          upcase.startsWith('FOREIGN KEY')
        ) {
          return null;
        }
      }

      return {
        num: maybeNum != null ? parseInt(maybeNum) : null,
        name: nullthrows(match?.groups?.name),
        type: match?.groups?.type || null,
        notnull: match?.groups?.nonnull === 'NOT NULL',
      };
    })
    .filter((c): c is ColumnDef => c != null);
}

/**
 * Find columns that were in the left but not in the right. Thus removed.
 * @param left
 * @param right
 * @returns
 */
export function findRemovedColumns(left: ColumnDef[], right: ColumnDef[]): ColumnDef[] {
  // if cols have numbers, compare on that.
  // otherwise, compare that cols with same name exist on both sides
  const allNumbered = left.every(c => c.num != null) && right.every(c => c.num != null);
  if (!allNumbered) {
    console.log('Not all columns were numbered. Determining removal by name.');
    return setDifference(left, right, x => x.name);
  }

  return setDifference(left, right, x => nullthrows(x.num));
}

/**
 * Find columns that are in the right but not left. Thus added.
 * @param left
 * @param right
 * @returns
 */
export function findAddedColumns(left: ColumnDef[], right: ColumnDef[]): ColumnDef[] {
  const allNumbered = left.every(c => c.num != null) && right.every(c => c.num != null);
  if (!allNumbered) {
    console.log('Not all columns were numbered. Determining addition by name.');
    return setDifference(right, left, x => x.name);
  }

  return setDifference(right, left, x => nullthrows(x.num));
}

/**
 * Return everything in l not in r
 * l - r
 * @param l
 * @param r
 * @param keyFn
 * @returns
 */
function setDifference<T>(l: T[], r: T[], keyFn: (e: T) => string | number): T[] {
  const set = new Set(r.map(keyFn));
  return l.filter(l => !set.has(keyFn(l)));
}

export function findAlteredColumns(
  left: ColumnDef[],
  right: ColumnDef[],
): [ColumnDef, ColumnDef][] {
  const allNumbered = left.every(c => c.num != null) && right.every(c => c.num != null);
  if (!allNumbered) {
    console.log(
      'Not all columns were numbered. Determining column alterations by name. Renames are seen as drops and adds in this case rather than alters. Number your columns to track renames. Similar idea to Thrift and protocol buffers.',
    );
  }
  return [];
}

function removeStatements(columns: ColumnDef[]): SQLQuery[] {
  return [];
}

function addStatements(columns: ColumnDef[]): SQLQuery[] {
  return [];
}

function modifyStatements(columns: [ColumnDef, ColumnDef][]): SQLQuery[] {
  return [];
}

/**
 * -- SIGNED-SOURCE: <39e0ffa72e52ff465fbd19ef78209317>\n' +
          'CREATE TABLE\n' +
          '  "decktoeditorsedge" ("id1" bigint NOT NULL, "id2" bigint NOT NULL)
 */
