import { context, Context, viewer, Cache, asId, commit, P } from '@aphro/runtime-ts';
import { destroyDb, initDb } from './testBase.js';
import UserMutations from '../generated/UserMutations';
import User from '../generated/User.js';
import { nullthrows } from '@strut/utils';

let ctx: Context;
const cache = new Cache();
beforeAll(async () => {
  const resolver = await initDb();
  ctx = context(viewer(asId('me')), resolver, cache);
});

test('Model subscription', async () => {});

test('queryAll subscription', async () => {
  const suffixes = [0, 1, 2, 3, 4];
  const changesets = suffixes.map(i =>
    UserMutations.create(ctx, {
      name: 'user' + i,
    }).toChangeset(),
  );

  let [persistHandle] = commit(ctx, changesets);
  await persistHandle;

  // Set up our live query
  const liveResult = User.queryAll(ctx).live();

  // Test that we get notified when it receives its initial data
  let wasNotified = false;
  let disposer = liveResult.subscribe(users => {
    wasNotified = true;
    const names = users.map(u => u.name);

    suffixes.forEach(i => {
      expect(names).toContain('user' + i);
    });
  });

  // __currentHandle represents the current reaction to the latest set of mutations. Exposed for tests.
  await liveResult.__currentHandle;
  expect(wasNotified).toBe(true);
  wasNotified = false;

  disposer();

  // Test that we get notified when a user in the returned set is modified
  // See "Reactivity Thoughts" in "TODO.md"
  liveResult.subscribe(users => {
    wasNotified = true;
    const names = users.map(u => u.name);
    expect(names).toContain('mutated name');
  });

  [persistHandle] = UserMutations.rename(nullthrows(liveResult.latest)[0], {
    name: 'mutated name',
  }).save();
  await persistHandle;

  await liveResult.__currentHandle;
  expect(wasNotified).toBe(true);
  wasNotified = false;

  liveResult.free();

  // Other cases to test:
  // - mutations!
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
