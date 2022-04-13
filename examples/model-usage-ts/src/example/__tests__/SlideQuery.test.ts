import sid from '@strut/sid';
import createTestTables from '../../createTestTables.js';
import SlideQuery from '../generated/SlideQuery.js';
import { create as createDb } from '../../db.js';

/**
 * Now that everything generates correctly...
 * lets try creating some queries and inspecting their plans.
 */

let db: ReturnType<typeof createDb>;
beforeAll(async () => {
  db = createDb();
  await createTestTables(db);
});

afterAll(() => {
  db.destroy();
});

test('Query from id', async () => {
  const plan = SlideQuery.fromId(sid('foo')).plan().optimize();
  const iterable = plan.iterable;

  // console.log(iterable);
  // // @ts-ignore - bypass for testing.
  // const sql = iterable.source.__getSQL();
  // console.log(sql);
});

// todo: https://dev.to/rukykf/integration-testing-with-nodejs-jest-knex-and-sqlite-in-memory-databases-2ila
