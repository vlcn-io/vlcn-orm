import { DBResolver } from '@aphro/runtime-ts';
import { create as createDb } from './db.js';

export function create(db: ReturnType<typeof createDb>): DBResolver {
  // TODO: supply utilities like "forwarding resolver" so ppl can do less.
  const resolver = {
    type(type: 'sql') {
      return typedResolver;
    },
  };

  const typedResolver = {
    engine(engine: any) {
      return specificResolver;
    },
  };

  const specificResolver = {
    db(dbName: string) {
      return db;
    },
  };

  return resolver;
}
