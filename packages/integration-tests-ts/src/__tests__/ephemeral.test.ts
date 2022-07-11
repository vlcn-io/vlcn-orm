import { asId, Cache, context, Context, noStorageResolver, viewer } from '@aphro/runtime-ts';

let ctx: Context;
let cache: Cache;
beforeAll(async () => {
  cache = new Cache();
  ctx = context(viewer(asId('me')), noStorageResolver, cache);

  // const s = new AppState(ctx, {
  //   id: asId('123'),
  //   openDeckId: asId('12345'),
  //   identity: new Identity(ctx, {
  //     id: asId('1234'),
  //     identifier: 'sdf',
  //     token: 'sdf',
  //   }),
  // });
});

test('Ephemeral nodes are not added to the cache on create', () => {});
test('Ephemeral nodes are not added to the cache on update', () => {});

test('Changes to ephemeral nodes can be observed', () => {});
