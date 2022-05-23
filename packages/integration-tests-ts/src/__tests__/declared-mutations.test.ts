import { context, Context, viewer, Cache, asId } from '@aphro/runtime-ts';
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
  const [user, _] = UserMutations.creation(ctx).create({ name: 'Bill' }).save();
  // TODO: enable refs so we can use an uncreated user.
  const [deck, __] = DeckMutations.creation(ctx)
    .create({
      name: 'First Presentation',
      owner: user,
      selectedSlide: null,
    })
    .save();

  expect(deck?.name).toEqual('Firs Presentation');
  expect(user?.name).toEqual('Bill');
});
