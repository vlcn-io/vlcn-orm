import { DBResolver } from '@aphro/runtime-ts';
import { basicResolver } from '@aphro/runtime-ts';
import { createConnection } from './Connection.js';
export { createConnection } from './Connection.js';

/**
 * Convenience function to create a connection to absurd-sql and return
 * a db resolver that resolves to that connection.
 *
 * You should _only_ ever call `openDbAndCreateResolver` one time from your application.
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
  const conn = await createConnection(file);
  return basicResolver(dbName, conn);
}
