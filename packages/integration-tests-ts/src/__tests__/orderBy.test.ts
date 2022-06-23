import { context, Context, viewer, Cache, asId, commit, P } from '@aphro/runtime-ts';
import { destroyDb, initDb } from './testBase.js';
import UserMutations from '../generated/UserMutations';
import User from '../generated/User.js';
import DeckMutations from '../generated/DeckMutations.js';
import SlideMutations from '../generated/SlideMutations.js';

let ctx: Context;
const cache = new Cache();
beforeAll(async () => {
  const resolver = await initDb();
  ctx = context(viewer(asId('me')), resolver, cache);

  const usersCs = [4, 3, 2, 1].map(i => UserMutations.create(ctx, { name: 'U' + i }).toChangeset());
  const deckCs = DeckMutations.create(ctx, {
    name: 'Deck 1',
    owner: usersCs[0],
    selectedSlide: null,
  }).toChangeset();
  const ordering = [4, 3, 2, 1];
  const slidesCs = ordering.map(o =>
    SlideMutations.create(ctx, {
      deck: deckCs,
      order: o,
    }).toChangeset(),
  );
  const [persistHandle] = commit(ctx, ...usersCs, deckCs, ...slidesCs);
  await persistHandle;
});

test('OrderBy', async () => {
  let users = await User.queryAll(ctx).orderByName().gen();
  expect(users.map(u => u.name)).toEqual([1, 2, 3, 4].map(i => 'U' + i));

  users = await User.queryAll(ctx).orderByName('desc').gen();
  expect(users.map(u => u.name)).toEqual([4, 3, 2, 1].map(i => 'U' + i));
});

// TODO: implement multi-hop order by
// test('multi hop order by', async () => {
//   const user = await User.queryAll(ctx).whereName(P.equals('U4')).genxOnlyValue();

//   const [slidesAsc, slidesDesc] = await Promise.all([
//     user.queryDecks().querySlides().orderByOrder('asc').gen(),
//     user.queryDecks().querySlides().orderByOrder('desc').gen(),
//   ]);

//   const ascOrders = slidesAsc.map(s => s.order);
//   const descOrders = slidesDesc.map(s => s.order);

//   expect(ascOrders).toEqual([1, 2, 3, 4]);
//   expect(descOrders).toEqual([4, 3, 2, 1]);
// });

test('order bys on model fields are optimized', () => {
  const plan = User.queryAll(ctx).orderByName().plan().optimize();
  expect(plan.derivations.length).toBe(1);
  expect(plan.derivations[0].type).toBe('modelLoad');
});

afterAll(async () => {
  await destroyDb();
});
