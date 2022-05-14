import sid, { asId } from '@strut/sid';
import createTestTables from '../../createTestTables.js';
import SlideQuery from '../generated/SlideQuery.js';
import { create as createDb } from '../../db.js';
import { create as createKnexResolver } from '../../knexResolver.js';
import { configure, debugContext } from '@aphro/context-runtime-ts';
import { viewer } from '@aphro/context-runtime-ts/src/viewer';

/**
 * Now that everything generates correctly...
 * lets try creating some queries and inspecting their plans.
 */

let db: ReturnType<typeof createDb>;
const ctx = debugContext(viewer(asId('me')));
beforeAll(async () => {
  db = createDb();
  configure({ resolver: createKnexResolver(db) });

  await createTestTables(db);
});

afterAll(() => {
  db.destroy();
});

test('Query from id', async () => {
  const plan = SlideQuery.fromId(ctx, sid('foo')).plan().optimize();
  const iterable = plan.iterable;

  const result = await iterable.gen();
  console.log(result);
});

// todo: https://dev.to/rukykf/integration-testing-with-nodejs-jest-knex-and-sqlite-in-memory-databases-2ila
