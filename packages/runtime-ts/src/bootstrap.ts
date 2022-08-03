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
    await create(
      resolver,
      sqlExports,
      s => {
        if (s.status === 'fulfilled') {
          return;
        }
        // sqlite errorno is 1.. which seems oddly unspecific.
        // using message contents -_-
        if (s.reason.message.indexOf('already exists') !== -1) {
          return;
        }
        throw s.reason;
      },
      engine,
      db,
    );
  },

  async createThrowIfExists(
    resolver: DBResolver,
    sqlExports: SQLExports,
    engine?: string,
    db?: string,
  ) {
    await create(
      resolver,
      sqlExports,
      s => {
        if (s.status === 'fulfilled') {
          return;
        }
        throw s.reason;
      },
      engine,
      db,
    );
  },

  /**
   * Auto-migrate will:
   * - change column types
   * - create new columns
   * - remove removed columns
   * - drop and recreate renamed columns
   */
  // createAndAutomigrateIfExists(BResolver, sqlExports: SQLExports, engine?: string, db?: string) {},
};

async function create(
  resolver: DBResolver,
  sqlExports: SQLExports,
  errorHandler: (r: PromiseSettledResult<void>) => void,
  engine?: string,
  db?: string,
) {
  if (engine != null) {
    await createForEngine(resolver, engine, sqlExports[engine], errorHandler, db);
    return;
  }
  for (const [engine, dbs] of Object.entries(sqlExports)) {
    await createForEngine(resolver, engine, dbs, errorHandler);
  }
}

async function createForEngine(
  resolver: DBResolver,
  engine: string,
  dbs: DBs,
  errorHandler: (r: PromiseSettledResult<void>) => void,
  db?: string,
) {
  if (db != null) {
    await createForDB(resolver.engine(engine as any), db, dbs[db], errorHandler);
    return;
  }
  for (const [dbName, schemas] of Object.entries(dbs)) {
    await createForDB(resolver.engine(engine as any), dbName, schemas, errorHandler);
  }
}

async function createForDB(
  engine: ReturnType<DBResolver['engine']>,
  dbName: string,
  schemas: Schemas,
  errorHandler: (r: PromiseSettledResult<void>) => void,
) {
  const db = engine.db(dbName);

  const settled = await Promise.allSettled(
    Object.values(schemas).map(s => db.query(sql.__dangerous__rawValue(s))),
  );

  settled.forEach(errorHandler);
}
