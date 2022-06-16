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

test('OrderBy', async () => {
  const [persistHandle] = commit(
    ctx,
    [1, 2, 3, 4].map(i => UserMutations.create(ctx, { name: 'U' + i }).toChangeset()),
  );
  await persistHandle;

  const users = await User.queryAll(ctx).orderByName().gen();
  expect(users.map(u => u.name)).toEqual([1, 2, 3, 4].map(i => 'U' + i));

  // const users = await User.queryAll(ctx).orderByName().map().gen();
});

test('order bys on model fields are optimized', async () => {});

afterAll(async () => {
  await destroyDb();
});
