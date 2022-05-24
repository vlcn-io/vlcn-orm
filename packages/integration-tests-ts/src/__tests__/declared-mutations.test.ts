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
  const userChangeset = UserMutations.creation(ctx).create({ name: 'Bill' }).toChangeset();
  // TODO: enable refs so we can use an uncreated user.
  const deckChangeset = DeckMutations.creation(ctx)
    .create({
      name: 'First Presentation',
      owner: userChangeset,
      selectedSlide: null,
    })
    .toChangeset();

  const [user, deck, persist] = commit(ctx, [userChangeset, deckChangeset]);
  // console.log(ret);
  //  = ret;

  expect(deck.name).toEqual('First Presentation');
  expect(user.name).toEqual('Bill');

  await persist;
});

afterAll(async () => {
  await destroyDb();
});
