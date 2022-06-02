import { context, Context, viewer, Cache, asId, commit, P } from '@aphro/runtime-ts';
import { destroyDb, initDb } from './testBase.js';
import UserMutations from '../generated/UserMutations';
import User from '../generated/User.js';

let ctx: Context;
const cache = new Cache();
beforeAll(async () => {
  const resolver = await initDb();
  ctx = context(viewer(asId('me')), resolver, cache);
});

test('Model subscription', async () => {});

test('Query all subscription', async () => {
  const suffixes = [0, 1, 2, 3, 4];
  const changesets = suffixes.map(i =>
    UserMutations.create(ctx, {
      name: 'user' + i,
    }).toChangeset(),
  );

  const [persistHandle, _] = commit(ctx, changesets);
  await persistHandle;

  const liveResult = User.queryAll(ctx).live();

  liveResult.subscribe(users => {
    const names = users.map(u => u.name);

    suffixes.forEach(i => {
      expect(names).toContain('user' + i);
    });
  });

  await liveResult.__currentHandle;

  liveResult.free();

  // Other cases to test:
  // - unrelated mutations do not trigger unrelated live queries
  // - no-op mutations do not trigger live queries
  //  - we should also check this in mutator tests to ensure persist never happens for no-ops
  //  - and model observers are not notified on no-ops
});

test('Filtered query subscription', async () => {});

test('Hop query subscription', async () => {});

afterAll(async () => {
  await destroyDb();
});
