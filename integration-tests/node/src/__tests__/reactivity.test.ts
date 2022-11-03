import { context, Context, viewer, Cache, asId, commit, P } from '@aphro/runtime-ts';
import { destroyDb, initDb } from './testBase.js';
import domain from '@aphro/integration-tests-shared';
const { UserMutations } = domain.sql;
const { User } = domain.sql;
import { UpdateType } from '@aphro/runtime-ts';

let ctx: Context;
const cache = new Cache();
beforeAll(async () => {
  const resolver = await initDb();
  ctx = context(viewer(asId('me')), resolver, cache);
});

test('Model subscription', async () => {});

test('queryAll subscription', async () => {
  const suffixes = [0, 1, 2, 3, 4];
  const changesets = suffixes.flatMap(i =>
    UserMutations.create(ctx, {
      name: 'user' + i,
    }).toChangesets(),
  );

  await commit(ctx, changesets);

  // Set up our live query
  const liveResult = User.queryAll(ctx).live(UpdateType.ANY);

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

  // Test that we get notified when a user in the returned set is modified
  // See "Reactivity Thoughts" in "TODO.md"
  liveResult.subscribe(users => {
    wasNotified = true;
    const names = users.map(u => u.name);
    expect(names).toContain('mutated name');
  });

  disposer();

  await liveResult
    .latest![0].update({
      name: 'mutated name',
    })
    .save();

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

test('reactivity via generator', async () => {
  const liveResult = User.queryAll(ctx).whereName(P.startsWith('user')).live(UpdateType.ANY);
  const g = liveResult.generator();

  await liveResult.__currentHandle;
  const result = await g.next().value;
  expect(result.length).toBeGreaterThan(0);

  await result[0].update({ name: '---' }).save();

  const newResult = await g.next().value;
  expect(newResult.length).toBeGreaterThan(0);
});

test('Filtered query subscription', async () => {});

test('Hop query subscription', async () => {});

afterAll(async () => {
  await destroyDb();
});
