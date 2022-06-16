import { context, Context, viewer, Cache, asId, commit, P } from '@aphro/runtime-ts';
import { destroyDb, initDb } from './testBase.js';
import UserMutations from '../generated/UserMutations';

let ctx: Context;
const cache = new Cache();
beforeAll(async () => {
  const resolver = await initDb();
  ctx = context(viewer(asId('me')), resolver, cache);
});

test('OrderBy', async () => {
  const [persistHandle, user] = UserMutations.create(ctx, { name: 'Bill' }).save();
  await persistHandle;
});

afterAll(async () => {
  await destroyDb();
});
