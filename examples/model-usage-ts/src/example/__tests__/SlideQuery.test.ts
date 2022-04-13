import sid from '@strut/sid';
import SlideQuery from '../generated/SlideQuery.js';

/**
 * Now that everything generates correctly...
 * lets try creating some queries and inspecting their plans.
 */

test('Query from id', async () => {
  const plan = SlideQuery.fromId(sid('foo')).plan().optimize();
  const iterable = plan.iterable;

  // console.log(iterable);
  // // @ts-ignore - bypass for testing.
  // const sql = iterable.source.__getSQL();
  // console.log(sql);
});

// todo: https://dev.to/rukykf/integration-testing-with-nodejs-jest-knex-and-sqlite-in-memory-databases-2ila
