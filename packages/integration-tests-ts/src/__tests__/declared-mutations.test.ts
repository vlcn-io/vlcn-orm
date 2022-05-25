import { context, Context, viewer, Cache, asId, commit } from '@aphro/runtime-ts';
import DeckMutations from '../generated/DeckMutations';
import UserMutations from '../generated/UserMutations';
import { initDb, destroyDb } from './testBase';

let ctx: Context;
beforeAll(async () => {
  const resolver = await initDb();
  ctx = context(viewer(asId('me')), resolver, new Cache());
});

test('Creating models via declared mutations', async () => {
  // TODO: collapse create?
  // TODO: can we remove some of the redundancy of `ctx`?
  const userChangeset = UserMutations.create(ctx, { name: 'Bill' }).toChangeset();
  // TODO: enable refs so we can use an uncreated user.
  const deckChangeset = DeckMutations.create(ctx, {
    name: 'First Presentation',
    owner: userChangeset,
    selectedSlide: null,
  }).toChangeset();

  const [persist, user, deck] = commit(ctx, [userChangeset, deckChangeset]);

  expect(deck.name).toEqual('First Presentation');
  expect(user.name).toEqual('Bill');

  await persist;
});

afterAll(async () => {
  await destroyDb();
});
