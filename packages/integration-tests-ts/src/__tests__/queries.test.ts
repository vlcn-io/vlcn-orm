import { context, Context, viewer, Cache, asId, commit, P } from '@aphro/runtime-ts';
import { destroyDb, initDb } from './testBase.js';
import UserMutations from '../generated/UserMutations';
import User from '../generated/User.js';
import DeckMutations from '../generated/DeckMutations.js';
import SlideMutations from '../generated/SlideMutations.js';
import ComponentMutations from '../generated/ComponentMutations.js';

let ctx: Context;
beforeAll(async () => {
  const resolver = await initDb();
  ctx = context(viewer(asId('me')), resolver, new Cache());
});

test('Point queries', async () => {
  const [persistHandle, user] = UserMutations.create(ctx, { name: 'Bill' }).save();
  await persistHandle;

  // TODO: add a `first` method
  // TODO: add a `gen` method to just load via id
  const users = await User.queryAll(ctx).whereId(P.equals(user.id)).gen();

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
  // TODO: just return a subclass of `Promise` that has an `optimistic` field on it.
  // People can await if they want the persisted or just use the optimistic version.
  const [optimisitc, persistHandle] = commit(ctx, changesets);
  await persistHandle;

  const users = await User.queryAll(ctx).gen();
  const names = users.map(u => u.name);

  suffixes.forEach(i => {
    expect(names).toContain('user' + i);
  });
});

test('Query with filter', async () => {});

test('Query that traverses edges', async () => {
  const userCs = UserMutations.create(ctx, {
    name: 'Bob',
  }).toChangeset();
  const deckCs = DeckMutations.create(ctx, {
    name: 'Preso',
    owner: userCs,
    selectedSlide: null, // TODO: enable ref to slide somehow...
  }).toChangeset();
  const slideCs = SlideMutations.create(ctx, {
    order: 0,
    deck: deckCs,
  }).toChangeset();
  const componentCs = ComponentMutations.create(ctx, {
    content: 'Welcome!',
    subtype: 'Text',
    slide: slideCs,
  }).toChangeset();
  const [persistHandle, user, component, slide, deck] = commit(ctx, [
    userCs,
    componentCs,
    slideCs,
    deckCs,
  ]);
  await persistHandle;

  const components = await user.queryDecks().querySlides().queryComponents().gen();

  // We should have gotten our created component back
  expect(components.map(c => c.id)).toEqual([component.id]);
  // The returned component should match the optimistic component / be the cached thing.
  expect(components).toEqual([component]);
});

afterAll(async () => {
  await destroyDb();
});
