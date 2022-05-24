import { context, Context, viewer, Cache, asId, commit, P } from '@aphro/runtime-ts';
import { destroyDb, initDb } from './testBase.js';
import UserMutations from '../generated/UserMutations';
import User from '../generated/User.js';
import UserQuery from '../generated/UserQuery.js';
import DeckMutations from '../generated/DeckMutations.js';
import SlideMutations from '../generated/SlideMutations.js';

let ctx: Context;
beforeAll(async () => {
  const resolver = await initDb();
  ctx = context(viewer(asId('me')), resolver, new Cache());
});

test('Point queries', async () => {
  const [user, persistHandle] = UserMutations.create(ctx, { name: 'Bill' }).save();
  await persistHandle;

  // TODO: add a `first` method
  const users = await UserQuery.create(ctx).whereId(P.equals(user.id)).gen();

  // user query for created user should be fulfilled from the cache
  expect(users[0]).toEqual(user);
});

test('Query all', async () => {
  const suffixes = [0, 1, 2, 3, 4];
  const changesets = suffixes.map(i =>
    UserMutations.create(ctx, {
      name: 'user' + i,
    }).toChangeset(),
  );
  const [optimisitc, persistHandle] = commit(ctx, changesets);
  await persistHandle;

  // TODO: this would be more ergonomic as `User.queryAll`
  const users = await UserQuery.create(ctx).gen();

  const names = users.map(u => u.name);

  suffixes.forEach(i => {
    expect(names).toContain('user' + i);
  });
});

test('Query with filter', async () => {});
test('Hop query', async () => {});

afterAll(async () => {
  await destroyDb();
});
