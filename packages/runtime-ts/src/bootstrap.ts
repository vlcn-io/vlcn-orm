import { DBResolver } from '@aphro/context-runtime-ts';
import { sql } from '@aphro/sql-ts';

export type SQLExports = { sqlite: DBs };
type DBs = { [dbName: string]: Schemas };
type Schemas = { [key: string]: string };

export const bootstrap = {
  /**
   * Tries to create the provided tables only if they do not exist
   * TODO: reference `StorageEngine` type
   *
   * Optionally provide and engine and db to only bootstrap a specific set of tables.
   */
  async createIfNotExists(
    resolver: DBResolver,
    sqlExports: SQLExports,
    engine?: string,
    db?: string,
  ) {
    create(resolver, sqlExports, engine, db);
  },

  /**
   * Creates all provided tables, dropping the old instances if they already exist and have different schemas
   * from the provided schemas.
   * ^-- we could figure this out via sqlite_schemas.
   * Should we even support this mode or just do automigrate mode?
   */
  // dropAndRecreateIfExists() {},

  /**
   * Auto-migrate will:
   * - change column types
   * - create new columns
   * - remove removed columns
   * - drop and recreate renamed columns
   */
  // createAndAutomigrateIfExists() {},
};

async function create(resolver: DBResolver, sqlExports: SQLExports, engine?: string, db?: string) {
  if (engine != null) {
    createForEngine(resolver, engine, sqlExports[engine], db);
    return;
  }
  for (const [engine, dbs] of Object.entries(sqlExports)) {
    createForEngine(resolver, engine, dbs);
  }
}

async function createForEngine(resolver: DBResolver, engine: string, dbs: DBs, db?: string) {
  if (db != null) {
    createForDB(resolver.engine(engine as any), db, dbs[db]);
    return;
  }
  for (const [dbName, schemas] of Object.entries(dbs)) {
    createForDB(resolver.engine(engine as any), dbName, schemas);
  }
}

async function createForDB(
  engine: ReturnType<DBResolver['engine']>,
  dbName: string,
  schemas: Schemas,
) {
  const db = engine.db(dbName);

  const settled = await Promise.allSettled(
    Object.values(schemas).map(s => db.query(sql.__dangerous__rawValue(s))),
  );

  settled.forEach(s => {
    if (s.status === 'rejected') {
      // swallow "table exists" errors, throw the rest
      console.log(s.reason);
    }
  });
}
