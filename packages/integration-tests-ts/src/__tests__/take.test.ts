import { context, Context, viewer, Cache, asId, commit, P } from '@aphro/runtime-ts';
import { destroyDb, initDb } from './testBase.js';
import UserMutations from '../generated/UserMutations';
import User from '../generated/User.js';

let ctx: Context;
const cache = new Cache();
beforeAll(async () => {
  const resolver = await initDb();
  ctx = context(viewer(asId('me')), resolver, cache);
});

test('Take', async () => {
  const [persistHandle] = commit(
    ctx,
    [1, 2, 3, 4].map(i => UserMutations.create(ctx, { name: 'U' + i }).toChangeset()),
  );
  await persistHandle;

  const two = await User.queryAll(ctx).take(2).gen();
  expect(two.length).toEqual(2);
});

test('Take is optimized', async () => {
  const plan = User.queryAll(ctx).take(2).plan().optimize();
  expect(plan.derivations.length).toBe(1);
  expect(plan.derivations[0].type).toEqual('modelLoad');
});

afterAll(async () => {
  await destroyDb();
});
