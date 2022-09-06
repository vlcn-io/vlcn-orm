import { context, Context, viewer, Cache, asId, commit, P } from '@aphro/runtime-ts';
import { destroyDb, initDb } from './testBase.js';
import domain from '@aphro/integration-tests-shared';
const { UserQuery, UserMutations } = domain.sql;

let ctx: Context;
const cache = new Cache();
beforeAll(async () => {
  const resolver = await initDb();
  ctx = context(viewer(asId('me')), resolver, cache);
});

test('Empty query with operations applied is still empty!', async () => {
  await commit(
    ctx,
    [1, 2, 3, 4].flatMap(i => UserMutations.create(ctx, { name: 'U' + i }).toChangesets()),
  );

  const noUsers = await UserQuery.empty(ctx).gen();
  expect(noUsers.length).toEqual(0);

  const noSlides = await UserQuery.empty(ctx).queryDecks().querySlides().gen();
  expect(noSlides.length).toEqual(0);

  // TODO: empty queries need to still function for count operations
  // const zero = await UserQuery.empty(ctx).count().genxOnlyValue();
  // expect(zero).toBe(0);
});

test('Empty is optimized', async () => {
  const plan = UserQuery.empty(ctx).plan().optimize();
  expect(plan.derivations.length).toBe(0);
});

afterAll(async () => {
  await destroyDb();
});
