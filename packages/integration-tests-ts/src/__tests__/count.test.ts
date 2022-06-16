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

test('count', async () => {
  let [persistHandle, user] = UserMutations.create(ctx, { name: 'Bill' }).save();
  await persistHandle;

  let count = await User.queryAll(ctx).count().genxOnlyValue();
  expect(count).toBe(1);

  [persistHandle] = commit(
    ctx,
    [1, 2, 3, 4].map(i => UserMutations.create(ctx, { name: 'U' + i }).toChangeset()),
  );

  await persistHandle;

  count = await User.queryAll(ctx).count().genxOnlyValue();
  expect(count).toBe(5);
});

test('count optimization', () => {
  const optimizedPlan = User.queryAll(ctx).count().plan().optimize();

  expect(optimizedPlan.derivations.length).toEqual(1);
  expect(optimizedPlan.derivations[0].type).toEqual('countLoad');
});

afterAll(async () => {
  await destroyDb();
});
