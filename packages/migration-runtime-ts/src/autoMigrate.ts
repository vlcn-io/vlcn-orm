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

/**
 * NOTE: this auto-migrator only works for sqlite
 * TODO: remove postgres support or create a branch to chose the right migrator.
 * @param migrationTasks
 */
export async function autoMigrate(migrationTasks: MigrationTask[]) {
  const byDb = new Map<SQLResolvedDB, MigrationTask[]>();
  migrationTasks.forEach(t => {
    let existing = byDb.get(t.db);
    if (existing == null) {
      existing = [];
      byDb.set(t.db, existing);
    }
    existing.push(t);
  });

  const promises: Promise<any>[] = [];
  for (const entry of byDb.entries()) {
    promises.push(migrateAllTasksForDB(entry[0], entry[1]));
  }
  await Promise.all(promises);
}

async function migrateAllTasksForDB(db: SQLResolvedDB, tasks: MigrationTask[]) {
  try {
    await db.transact(async (conn: SQLResolvedDB) => {
      await Promise.all(tasks.map(task => migrateOne(conn, task)));
    });
  } catch (e) {
    throw {
      cause: e,
      message: 'Failed to commit the migration. Rolling it back. ' + (e as any)?.message,
    };
  }
}

// TODO: once you add index support you need to add index migration support.
// How will / should we detect dropped indices?
// Well we can find them via `where type = index and name = table name`
async function migrateOne(db: SQLResolvedDB, task: MigrationTask) {
  const newSql = task.sql.replaceAll('\n', '');

  const tableName = extractTableName(newSql);
  const oldSql = (await getOldSql(db, tableName)).replaceAll('\n', '');
  console.log(oldSql);
  console.log(newSql);

  const oldColumnDefs = extractColumnDefs(oldSql);
  const newColumnDefs = extractColumnDefs(newSql);

  const removedColumns = findRemovedColumns(oldColumnDefs, newColumnDefs);
  const addedColumns = findAddedColumns(oldColumnDefs, newColumnDefs);
  const modifiedColumns = findAlteredColumns(oldColumnDefs, newColumnDefs);

  const alterTableStatements = [
    ...removeStatements(tableName, removedColumns),
    ...addStatements(tableName, addedColumns),
    ...modifyStatements(tableName, modifiedColumns),
  ];

  // TODO: counter & real logging infra
  if (alterTableStatements.length === 0) {
    console.log(`table ${tableName} did not change`);
  }

  await Promise.all(alterTableStatements.map(stmt => db.write(stmt)));
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
  const rows = await db.read(
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
      const match = c.match(/^"(?<name>.*?)"\s*(?<nonnull>NOT NULL)?\s*(\/\*(?<meta>.*)\*\/)?/);
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
    console.log(
      'Not all columns were numbered (in both the new and old schema). Determining addition by name.',
    );
    return setDifference(right, left, x => x.name);
  }

  return setDifference(right, left, x => nullthrows(x.num));
}

export function findAlteredColumns(
  left: ColumnDef[],
  right: ColumnDef[],
): [ColumnDef, ColumnDef][] {
  const allNumbered = left.every(c => c.num != null) && right.every(c => c.num != null);
  let ret: [ColumnDef, ColumnDef][];
  if (!allNumbered) {
    console.log(
      'Not all columns were numbered (in both the old and new schema). Determining column alterations by name. Renames are seen as drops and adds in this case rather than alters. Number your columns to track renames. Similar idea to Thrift and protocol buffers.',
    );
    ret = innerJoin(left, right, x => x.name);
    // for each in right, find its correspond in left (or omit it if not exists).
    // see if it matches its correspond in left. omit it if so.
  } else {
    ret = innerJoin(left, right, x => nullthrows(x.num));
  }

  // Only keep joined pairs the have differences
  // not comparing on type since sqlite doesn't enforce type.
  // TODO: maybe in the future we want to? So we can re-write incorrectly typed data?
  // sqlite currently only supports renames of columns and not adding/removing constraints or changing types.
  // So... unconstrain our columns a bit.
  return ret.filter(([l, r]) => l.name !== r.name);
}

function removeStatements(tableName: string, columns: ColumnDef[]): SQLQuery[] {
  return columns.map(
    c => sql`ALTER TABLE ${sql.ident(tableName)} DROP COLUMN ${sql.ident(c.name)}`,
  );
}

function addStatements(tableName: string, columns: ColumnDef[]): SQLQuery[] {
  // TODO: not adding type info. -- see commit message that added this line.
  return columns.map(c => {
    const meta = c.num != null ? `/* n=${c.num} */` : '';
    return sql`ALTER TABLE ${sql.ident(tableName)} ADD COLUMN ${sql.ident(
      c.name,
    )}${sql.__dangerous__rawValue(meta)}`;
  });
}

// o.. sqlite has no modify other than rename :/
// https://stackoverflow.com/questions/2685885/sqlite-modify-column
function modifyStatements(tableName: string, columns: [ColumnDef, ColumnDef][]): SQLQuery[] {
  return columns.map(([l, r]) => {
    return sql`ALTER TABLE ${sql.ident(tableName)} RENAME COLUMN ${sql.ident(
      l.name,
    )} TO ${sql.ident(r.name)}`;
  });
}

/**
 * Return everything in l not in r
 * l - r
 * @param l
 * @param r
 * @param keyFn
 * @returns
 */
export function setDifference<T>(l: T[], r: T[], keyFn: (e: T) => string | number): T[] {
  const set = new Set(r.map(keyFn));
  return l.filter(l => !set.has(keyFn(l)));
}

export function innerJoin<T extends {}>(
  l: T[],
  r: T[],
  keyFn: (e: T) => string | number,
): [T, T][] {
  const map = new Map<string | number, T>(l.map(x => [keyFn(x), x]));
  return r
    .map(x => {
      const other = map.get(keyFn(x));
      if (other == null) {
        return null;
      }
      return [other, x] as const;
    })
    .filter((x): x is [T, T] => x != null);
}
