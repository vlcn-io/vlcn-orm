import { DBResolver, EngineToResolved } from '@aphro/context-runtime-ts';
import { SQLQuery } from '@aphro/sql-ts';

export * from '@aphro/context-runtime-ts';
export * from '@aphro/model-runtime-ts';
export * from '@aphro/mutator-runtime-ts';
export * from '@aphro/query-runtime-ts';
export * from '@strut/sid';
export { default as sid } from '@strut/sid';
export { default as Cache } from '@aphro/cache-runtime-ts';
export * from '@aphro/sql-ts';

export function resolverFromConnection(connection: {
  query: (query: SQLQuery) => Promise<any[]>;
  dispose(): Promise<void>;
}): DBResolver {
  return {
    engine(e: 'sqlite') {
      return {
        db(db: string) {
          return {
            type: 'sql',
            exec(q: SQLQuery) {
              return connection.query(q);
            },
            destroy() {
              connection.dispose();
            },
          };
        },
      };
    },
  };
}
