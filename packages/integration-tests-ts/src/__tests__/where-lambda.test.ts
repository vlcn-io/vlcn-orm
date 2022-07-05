import { asId, Context, context, viewer } from '@aphro/runtime-ts';
import User from '../generated/User.js';
import { default as UserMem } from '../generated-memory/User.js';
import createGraph from './createGraph.js';
import { initDb } from './testBase.js';

let ctx: Context;
beforeAll(async () => {
  const resolver = await initDb();
  ctx = context(viewer(asId('me')), resolver);
  await createGraph(ctx);
});

// Note: "where(lambda)" can never be hoisted
// and thus should rarely, if ever, be used.
test('Where lambda', async () => {
  const [u1sql, u1mem] = await Promise.all([
    User.queryAll(ctx)
      .where(u => u.name === 'U1')
      .genxOnlyValue(),
    UserMem.queryAll(ctx)
      .where(u => u.name === 'U1')
      .genxOnlyValue(),
  ]);

  expect(u1sql.name).toEqual('U1');
  expect(u1mem.name).toEqual('U1');
});

test('Map', async () => {
  const [sqlNames, memNames] = await Promise.all([
    User.queryAll(ctx)
      .orderByName()
      .map(u => u.name)
      .gen(),
    UserMem.queryAll(ctx)
      .orderByName()
      .map(u => u.name)
      .gen(),
  ]);

  expect(sqlNames).toEqual(['U1', 'U2', 'U3', 'U4']);
  expect(memNames).toEqual(['U1', 'U2', 'U3', 'U4']);
});
