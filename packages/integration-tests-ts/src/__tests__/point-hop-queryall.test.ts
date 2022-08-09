import { context, Context, viewer, Cache, asId, commit, P } from '@aphro/runtime-ts';
import { destroyDb, initDb } from './testBase.js';
import UserMutations from '../generated/generated/UserMutations';
import User from '../generated/User.js';
import DeckMutations from '../generated/generated/DeckMutations.js';
import SlideMutations from '../generated/generated/SlideMutations.js';
import ComponentMutations from '../generated/generated//ComponentMutations.js';
import { default as UserMem } from '../generated-memory/User.js';
import { default as UserMutationsMem } from '../generated-memory/generated//UserMutations.js';
import { default as DeckMutationsMem } from '../generated-memory/generated//DeckMutations.js';
import { default as SlideMutationsMem } from '../generated-memory/generated//SlideMutations.js';
import { default as ComponentMutationsMem } from '../generated-memory/generated//ComponentMutations.js';

let ctx: Context;
const cache = new Cache();
beforeAll(async () => {
  const resolver = await initDb();
  ctx = context(viewer(asId('me')), resolver, cache);
});

test('Point queries', async () => {
  const user = await UserMutations.create(ctx, { name: 'Bill' }).save();

  const reloadedUser = await User.genx(ctx, user.id);

  // user query for created user should be fulfilled from the cache
  expect(reloadedUser).toEqual(user);
});

test('Query that traverses edges', async () => {
  await Promise.all([
    testQueryThatTraversesEdges(UserMutations, DeckMutations, SlideMutations, ComponentMutations),
    testQueryThatTraversesEdges(
      UserMutationsMem,
      DeckMutationsMem,
      SlideMutationsMem,
      ComponentMutationsMem,
    ),
  ]);
});

test('Query all', async () => {
  await Promise.all([testQueryAll(User, UserMutations), testQueryAll(UserMem, UserMutationsMem)]);
});

async function testQueryAll(
  Model: typeof User | typeof UserMem,
  Mutations: typeof UserMutations | typeof UserMutationsMem,
): Promise<void> {
  const suffixes = [0, 1, 2, 3, 4];
  const changesets = suffixes.flatMap(i =>
    Mutations.create(ctx, {
      name: 'user' + i,
    }).toChangesets(),
  );

  await commit(ctx, changesets);

  const users = await Model.queryAll(ctx).gen();
  const names = users.map(u => u.name);

  suffixes.forEach(i => {
    expect(names).toContain('user' + i);
  });
}

async function testQueryThatTraversesEdges(
  UsrMutations: typeof UserMutations | typeof UserMutationsMem,
  DckMutations: typeof DeckMutations | typeof DeckMutationsMem,
  SldMutations: typeof SlideMutations | typeof SlideMutationsMem,
  CmpMutations: typeof ComponentMutations | typeof ComponentMutationsMem,
): Promise<void> {
  const userCs = UsrMutations.create(ctx, {
    name: 'Bob',
  }).toChangesets();
  const deckCs = DckMutations.create(ctx, {
    name: 'Preso',
    // @ts-ignore
    owner: userCs[0],
    selectedSlide: null, // TODO: enable ref to slide somehow...
  }).toChangesets();
  const slideCs = SldMutations.create(ctx, {
    order: 0,
    // @ts-ignore
    deck: deckCs[0],
  }).toChangesets();
  const componentCs = CmpMutations.create(ctx, {
    content: 'Welcome!',
    subtype: 'Text',
    // @ts-ignore
    slide: slideCs[0],
  }).toChangesets();
  const [user, component, slide, deck] = await commit(
    ctx,
    ...userCs,
    ...componentCs,
    ...slideCs,
    ...deckCs,
  );

  const components = await user.queryDecks().querySlides().queryComponents().gen();

  // We should have gotten our created component back
  expect(components.map(c => c.id)).toEqual([component.id]);
  // The returned component should match the optimistic component / be the cached thing.
  expect(components).toEqual([component]);
}

afterAll(async () => {
  await destroyDb();
});
