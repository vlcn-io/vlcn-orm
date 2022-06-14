import { nullthrows } from '@strut/utils';
import { basicResolver, DBResolver, SQLQuery } from '@aphro/runtime-ts';
import connect from '@databases/sqlite';

function createDb() {
  return connect();
}

let db: ReturnType<typeof createDb> | null = null;
function createResolver(): DBResolver {
  if (db == null) {
    db = createDb();
  }

  return basicResolver(db);
}

export const resolver = createResolver();
