import { asId, Context, context, P, sql, viewer } from '@aphro/runtime-ts';
import domain from '@aphro/integration-tests-shared';
const { User, UserSpec } = domain.sql;

import createGraph from './createGraph.js';
import { destroyDb, initDb } from './testBase.js';

let ctx: Context;
beforeAll(async () => {
  const resolver = await initDb();
  ctx = context(viewer(asId('me')), resolver);
  await createGraph(ctx);
});

test('direct loads', async () => {
  const allUsers = await User.queryAll(ctx).gen();

  // Drop table out from under Aphrodite in order to test that
  // point queries for loaded users are resolved from the cache
  await ctx.dbResolver
    .engine('sqlite')
    .db('test')
    .write(sql`DROP TABLE ${sql.ident(UserSpec.storage.tablish)}`);

  // make sure the table is gone and we cannot query from it
  let threw = false;
  try {
    await User.queryAll(ctx).gen();
  } catch (e) {
    threw = true;
  }
  // expect(() => ...).toThrow doesn't seem to work with async functions?
  expect(threw).toBe(true);

  const fromGen = await Promise.all(allUsers.map(u => User.genx(ctx, u.id)));
  const fromQuery = await Promise.all(
    allUsers.map(u => User.queryAll(ctx).whereId(P.equals(u.id)).genxOnlyValue()),
  );

  expect(fromGen).toEqual(allUsers);
  expect(fromQuery).toEqual(allUsers);
});
