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
  const [persistHandle, user] = UserMutations.create(ctx, { name: 'Bill' }).save();
  await persistHandle;

  const count = await User.queryAll(ctx).count().genxOnlyValue();
  expect(count).toBe(1);
});

test('count optimization', () => {});

afterAll(async () => {
  await destroyDb();
});
