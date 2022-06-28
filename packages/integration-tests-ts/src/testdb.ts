import { nullthrows } from '@strut/utils';
import { basicResolver, DBResolver, MemoryDB, SQLQuery } from '@aphro/runtime-ts';
import connect from '@databases/sqlite';

function sqlDb() {
  return connect();
}

function memDb() {
  return new MemoryDB();
}

let db: ReturnType<typeof sqlDb> | null = null;
let mDb: ReturnType<typeof memDb> | null = null;
function createResolver(): DBResolver {
  if (db == null) {
    db = sqlDb();
  }

  return {
    // TODO
    // @ts-ignore
    engine(e: 'sqlite' | 'memory') {
      switch (e) {
        case 'sqlite':
          return {
            db(db: string) {
              return sqlDb;
            },
          };
        case 'memory':
          return {
            db(db: string) {
              return memDb;
            },
          };
      }
    },
  };
}

export const resolver = createResolver();
