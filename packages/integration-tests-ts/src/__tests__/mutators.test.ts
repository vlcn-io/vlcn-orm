import { Context } from '@aphro/context-runtime-ts';
import { context } from '@aphro/context-runtime-ts';
import { viewer } from '@aphro/context-runtime-ts';
import { commit, CreateMutationBuilder } from '@aphro/mutator-runtime-ts';
import sid, { asId } from '@strut/sid';
import spec from '../generated/UserSpec.js';
import { destroyDb, initDb } from './testBase.js';
import Cache from '@aphro/cache-runtime-ts';
const device = 'sdf';

let ctx: Context;
beforeAll(async () => {
  const resolver = await initDb();
  ctx = context(viewer(asId('me')), resolver, new Cache());
});

test('Creating models via mutators', async () => {
  const cs = new CreateMutationBuilder(spec)
    .set({
      id: sid(device),
      created: Date.now(),
      modified: Date.now(),
      name: 'Bart',
    })
    .toChangeset();
  expect(async () => await commit(ctx, [cs])).not.toThrow();
});

afterAll(async () => {
  await destroyDb();
});
