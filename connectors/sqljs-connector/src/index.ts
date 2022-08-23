import { DBResolver, basicResolver, SQLResolvedDB, sql } from '@aphro/runtime-ts';
// @ts-ignore
import initSqlJs from '@aphro/sql.js';
import { Connection, createConnection } from './Connection.js';

/**
 * Convenience function to create a connection to absurd-sql and return
 * a db resolver that resolves to that connection.
 *
 * You should _only_ ever call `createResolver` one time from your application.
 * After calling `createResolver`, attach the provided resolver to `Context` and/or pass
 * your resolver instance around to where it is needed.
 *
 * Only call this once since each call will try to start up a new sqlite instance.
 *
 * @returns DBResolver
 */
export async function openDbAndCreateResolver(
  dbName: string,
  file: string | null,
): Promise<DBResolver> {
  const sqlPromise = initSqlJs({
    locateFile: (file: string) => {
      return 'https://esm.sh/@aphro/sql.js/dist/sql-wasm.wasm';
    },
  });
  let dataPromise: Promise<ArrayBuffer> | null = null;
  if (file != null) {
    dataPromise = fetch(file).then(res => res.arrayBuffer());
  }
  const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
  return basicResolver(dbName, createConnection(SQL, buf));
}
