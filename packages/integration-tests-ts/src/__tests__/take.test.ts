import { context, Context, viewer, Cache, asId, commit, P } from '@aphro/runtime-ts';
import { destroyDb, initDb } from './testBase.js';
import UserMutations from '../generated/generated//UserMutations.js';
import User from '../generated/User.js';

import { default as MemoryUser } from '../generated-memory/User.js';
import { default as MemoryUserMutations } from '../generated-memory/generated/UserMutations.js';

let ctx: Context;
const cache = new Cache();
beforeAll(async () => {
  const resolver = await initDb();
  ctx = context(viewer(asId('me')), resolver, cache);
});

test('Take', async () => {
  await testTake(User, UserMutations);
  await testTake(MemoryUser, MemoryUserMutations);
});

test('Take is optimized', async () => {
  const plan = User.queryAll(ctx).take(2).plan().optimize();
  expect(plan.derivations.length).toBe(1);
  expect(plan.derivations[0].type).toEqual('modelLoad');
});

afterAll(async () => {
  await destroyDb();
});

async function testTake(
  Model: typeof User | typeof MemoryUser,
  Mutations: typeof UserMutations | typeof MemoryUserMutations,
): Promise<void> {
  await commit(
    ctx,
    [1, 2, 3, 4].map(i => Mutations.create(ctx, { name: 'U' + i }).toChangeset()),
  );

  const two = await Model.queryAll(ctx).take(2).gen();
  expect(two.length).toEqual(2);
}
