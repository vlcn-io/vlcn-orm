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
export async function openDbAndCreateResolver(dbName: string): Promise<DBResolver> {
  const pool = await createPool(dbName);
  return basicResolver(dbName, pool);
}
