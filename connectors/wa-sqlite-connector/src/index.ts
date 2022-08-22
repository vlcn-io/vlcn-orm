import createConnection from './connection.js';
import { DBResolver, basicResolver } from '@aphro/runtime-ts';
import createPool from './ConnectionPool.js';

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
  // set pool to 1 since pooling connections doesn't seem to do anything in wa-sqlite
  poolSize: number = 1,
): Promise<DBResolver> {
  if (poolSize < 2) {
    const connection = await createConnection(dbName);
    return basicResolver(dbName, connection);
  } else {
    console.warn('connection pooling does not seem to work in wa-sqlite');
    const pool = await createPool(dbName, poolSize);
    return basicResolver(dbName, pool);
  }
}
