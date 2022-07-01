import { nullthrows } from '@strut/utils';
import { basicResolver, DBResolver, MemoryDB, SQLQuery } from '@aphro/runtime-ts';
import connect from '@databases/sqlite';

function sqlDb() {
  return connect();
}

function memDb() {
  return new MemoryDB();
}

let sqlConnection: ReturnType<typeof sqlDb> | null = null;
let memoryConnection: ReturnType<typeof memDb> | null = null;
function createResolver(): DBResolver {
  if (sqlConnection == null) {
    sqlConnection = sqlDb();
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

export const resolver = createResolver();
