import { context, Context, viewer, Cache, asId, P } from '@aphro/runtime-ts';
import { destroyDb, initDb } from './testBase.js';
import domain from '@aphro/integration-tests-shared';
const { User } = domain.sql;
import createGraph from './createGraph.js';

let ctx: Context;
const cache = new Cache();
beforeAll(async () => {
  const resolver = await initDb();
  ctx = context(viewer(asId('me')), resolver, cache);

  await createGraph(ctx);
});

test('multi hop count', async () => {
  const user = await User.queryAll(ctx).whereName(P.equals('U4')).genxOnlyValue();

  const count = await user.queryDecks().querySlides().count().genxOnlyValue();
  expect(count).toBe(4);

  expect(await user.queryDecks().count().genxOnlyValue()).toBe(1);
  // TODO: we should return 0 when no data comes back, not null!!!
  expect(await user.queryDecks().querySlides().queryComponents().count().genOnlyValue()).toBe(null);
});

test('multi hop counts are optimized', async () => {
  const user = await User.queryAll(ctx).whereName(P.equals('U4')).genxOnlyValue();
  const plan = user.queryDecks().querySlides().queryComponents().count().plan().optimize();
  expect(plan.derivations.length).toBe(1);
  expect(plan.derivations[0].type).toBe('countLoad');
});

afterAll(async () => {
  await destroyDb();
});
