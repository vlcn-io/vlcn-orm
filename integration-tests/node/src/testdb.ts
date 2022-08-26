import { DBResolver, MemoryDB, SQLResolvedDB } from '@aphro/runtime-ts';
import { createConnection } from '@aphro/sqlite3-connector';

function sqlDb() {
  return createConnection(null);
}

function memDb() {
  return new MemoryDB();
}

let sqlConnection: SQLResolvedDB | null = null;
let memoryConnection: ReturnType<typeof memDb> | null = null;
async function createResolver(): Promise<DBResolver> {
  if (sqlConnection == null) {
    sqlConnection = await sqlDb();
  }
  if (memoryConnection == null) {
    memoryConnection = memDb();
  }

  return {
    // TODO
    // @ts-ignore
    engine(e: 'sqlite' | 'memory') {
      switch (e) {
        case 'sqlite':
          return {
            db(db: string) {
              return sqlConnection;
            },
          };
        case 'memory':
          return {
            db(db: string) {
              return memoryConnection;
            },
          };
      }
    },
  };
}

export const resolver = await createResolver();
