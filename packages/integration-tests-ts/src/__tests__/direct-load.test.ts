import { asId, Context, context, viewer } from '@aphro/runtime-ts';
import createGraph from './createGraph.js';
import { destroyDb, initDb } from './testBase.js';

let ctx: Context;
beforeAll(async () => {
  const resolver = await initDb();
  ctx = context(viewer(asId('me')), resolver);
  await createGraph(ctx);
});

test('direct loads', async () => {});
