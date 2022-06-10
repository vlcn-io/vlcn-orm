import Connection from './main/connection.js';
export { default as Connection } from './main/connection.js';
import { DBResolver, basicResolver } from '@aphro/context-runtime-ts';

export async function createResolver(): Promise<DBResolver> {
  const connection = new Connection();
  await connection.ready;
  return basicResolver(connection);
}
