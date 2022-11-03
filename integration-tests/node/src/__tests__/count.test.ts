import { context, Context, viewer, Cache, asId, commit, P } from '@aphro/runtime-ts';
import { destroyDb, initDb } from './testBase.js';
import domain from '@aphro/integration-tests-shared';
const { User } = domain.sql;

let ctx: Context;
const cache = new Cache();
beforeAll(async () => {
  const resolver = await initDb();
  ctx = context(viewer(asId('me')), resolver, cache);
});

test('count', async () => {
  await User.create(ctx, { name: 'Bill' }).save();

  let count = await User.queryAll(ctx).count().genxOnlyValue();
  expect(count).toBe(1);

  await commit(
    ctx,
    [1, 2, 3, 4].flatMap(i => User.create(ctx, { name: 'U' + i })),
  );

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
