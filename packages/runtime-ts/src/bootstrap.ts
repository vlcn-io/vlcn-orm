import { DBResolver, SQLResolvedDB } from '@aphro/context-runtime-ts';
import { sql } from '@aphro/sql-ts';

export type SQLExports = { sqlite: DBs };
type DBs = { [dbName: string]: Schemas };
type Schemas = { [key: string]: string };
type CreateError = {
  cause: any;
  sql: string;
  schemaName: string;
  db: SQLResolvedDB;
};

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
        if (s.reason.cause.message.indexOf('already exists') !== -1) {
          return;
        }
        throw s.reason.cause;
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
  async createAutomigrateIfExists(
    resolver: DBResolver,
    sqlExports: SQLExports,
    engine?: string,
    db?: string,
  ) {
    let tryToMigrate: CreateError[] = [];
    await create(
      resolver,
      sqlExports,
      s => {
        if (s.status === 'fulfilled') {
          return;
        }
        // sqlite errorno is 1.. which seems oddly unspecific.
        // using message contents -_-
        if (s.reason.cause.message.indexOf('already exists') !== -1) {
          tryToMigrate.push(s.reason);
          return;
        }
        throw s.reason.cause;
      },
      engine,
      db,
    );

    await migrate(tryToMigrate);
  },
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
    Object.entries(schemas).map(async ([name, s]) => {
      try {
        await db.query(sql.__dangerous__rawValue(s));
      } catch (e) {
        throw {
          cause: e,
          sql: s,
          schemaName: name,
          db: db,
        };
      }
    }),
  );

  settled.forEach(errorHandler);
}

async function migrate(migrationTasks: CreateError[]) {
  // 1. pull table name
  // 2. get the old schema
  // 3. format the schemas to match one another
  // 4. diff
  // 5. add or remove columns
  // console.log(migrationTasks);
  await Promise.all(migrationTasks.map(migrateOne));
}

async function migrateOne({ db, schemaName, sql }: CreateError) {
  // 1 - remove comments
  // 2 - remove newlines
  // 3 - regex extract table name
  // 4 - regex extract column def list
  // 5 - split on ',' to get columns and constraints
  // 6 - compare line by line to find deltas
  // 7 - create alter table statement to bring to new state
  // ^-- move all this to the migrate package?
}

/**
 * -- SIGNED-SOURCE: <39e0ffa72e52ff465fbd19ef78209317>\n' +
          'CREATE TABLE\n' +
          '  "decktoeditorsedge" ("id1" bigint NOT NULL, "id2" bigint NOT NULL)
 */
