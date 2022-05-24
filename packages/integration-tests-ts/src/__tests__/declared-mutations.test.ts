import { context, Context, viewer, Cache, asId, commit } from '@aphro/runtime-ts';
import DeckMutations from '../generated/DeckMutations';
import User from '../generated/User';
import UserMutations from '../generated/UserMutations';
import { initDb } from './testBase';

let ctx: Context;
beforeAll(async () => {
  const resolver = await initDb();
  ctx = context(viewer(asId('me')), resolver, new Cache());
});

test('Creating models via declared mutations', () => {
  // TODO: collapse create?
  // TODO: can we remove some of the redundancy of `ctx`?
  const userChangeset = UserMutations.creation(ctx).create({ name: 'Bill' }).toChangeset();
  // TODO: enable refs so we can use an uncreated user.
  const deckChangeset = DeckMutations.creation(ctx)
    .create({
      name: 'First Presentation',
      owner: user,
      selectedSlide: null,
    })
    .toChangeset();

  const ret = commit(ctx, [userChangeset, deckChangeset]);
  const x = ret[0];

  expect(deck?.name).toEqual('Firs Presentation');
  expect(user?.name).toEqual('Bill');
});
