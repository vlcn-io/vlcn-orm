import createTestTables from '../createTestTables.js';
import { resolver } from '../testdb.js';

export async function initDb() {
  await createTestTables();
  return resolver;
}

export async function destroyDb() {
  const db = resolver.engine('sqlite').db('test');
  await db.dispose();
}
