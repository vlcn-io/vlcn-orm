import { context, Context, viewer, Cache, asId, commit, P } from '@aphro/runtime-ts';
import { destroyDb, initDb } from './testBase.js';
import UserMutations from '../generated/UserMutations';
import User from '../generated/User.js';

// TODO: figure out how we can migrate all this to property based test (e.g., fast check)
// e.g., apply all predicates
// filter against a variety of values

let ctx: Context;
const cache = new Cache();
beforeAll(async () => {
  const resolver = await initDb();
  ctx = context(viewer(asId('me')), resolver, cache);
});

test('filter', async () => {
  const [persistHandle] = commit(
    ctx,
    [1, 2, 3, 4].map(i => UserMutations.create(ctx, { name: 'U' + i }).toChangeset()),
  );
  await persistHandle;

  await Promise.all(
    [1, 2, 3, 4].map(async i => {
      const u = await User.queryAll(ctx)
        .whereName(P.equals('U' + i))
        .genxOnlyValue();
      expect(u.name).toEqual('U' + i);
    }),
  );
});

test('filters on model fields are optimized', async () => {
  const plan = User.queryAll(ctx).whereName(P.equals('x')).plan().optimize();
  expect(plan.derivations.length).toBe(1);
  expect(plan.derivations[0].type).toEqual('modelLoad');
});

afterAll(async () => {
  await destroyDb();
});
