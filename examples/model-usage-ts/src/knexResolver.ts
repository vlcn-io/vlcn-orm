import { DBResolver } from '@aphro/config-runtime-ts';
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
    tablish(tablish: string) {
      return knexDb;
    },
  };

  const knexDb = {
    async exec(query: string, bindings: readonly any[]): Promise<any> {
      return await db.raw(query, bindings);
    },
  };

  return resolver;
}
