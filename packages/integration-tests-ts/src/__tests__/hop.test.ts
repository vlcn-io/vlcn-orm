import { context, Context, viewer, Cache, asId, commit, P } from '@aphro/runtime-ts';
import { destroyDb, initDb } from './testBase.js';
import UserMutations from '../generated/UserMutations';
import DeckMutations from '../generated/DeckMutations.js';
import SlideMutations from '../generated/SlideMutations.js';
import ComponentMutations from '../generated/ComponentMutations.js';

let ctx: Context;
beforeAll(async () => {
  const resolver = await initDb();
  ctx = context(viewer(asId('me')), resolver, new Cache());
});

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

  const plan = user.queryDecks().querySlides().queryComponents().plan();
  console.log(plan);
  // const components = await user.queryDecks().querySlides().queryComponents().gen();
  // console.log(components);
});

afterAll(async () => {
  await destroyDb();
});
