import { context, Context, viewer, Cache, asId, commit, P } from '@aphro/runtime-ts';
import { destroyDb, initDb } from './testBase.js';
import domain from '@aphro/integration-tests-shared';
const { User } = domain.sql;

import createGraph from './createGraph.js';

// TODO: figure out how we can migrate all this to property based test (e.g., fast check)
// e.g., apply all predicates
// filter against a variety of values

let ctx: Context;
const cache = new Cache();
beforeAll(async () => {
  const resolver = await initDb();
  ctx = context(viewer(asId('me')), resolver, cache);

  await createGraph(ctx);
});

test('filter', async () => {
  await Promise.all(
    [1, 2, 3, 4].map(async i => {
      const u = await User.queryAll(ctx)
        .whereName(P.equals('U' + i))
        .genxOnlyValue();
      expect(u.name).toEqual('U' + i);
    }),
  );

  const users = await User.queryAll(ctx).whereName(P.startsWith('U')).gen();
  expect(users.map(u => u.name).sort()).toEqual(['U1', 'U2', 'U3', 'U4']);
});

test('filters against multi-hops', async () => {
  const user = await User.queryAll(ctx).whereName(P.equals('U4')).genxOnlyValue();
  const slide3 = await user.queryDecks().querySlides().whereOrder(P.equals(3)).genxOnlyValue();

  expect(slide3.order).toBe(3);
});

test('filters on model fields are optimized', async () => {
  const plan = User.queryAll(ctx).whereName(P.equals('x')).plan().optimize();
  expect(plan.derivations.length).toBe(1);
  expect(plan.derivations[0].type).toEqual('modelLoad');
});

afterAll(async () => {
  await destroyDb();
});
