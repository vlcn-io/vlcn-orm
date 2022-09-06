import { context, Context, viewer, Cache, asId, commit, P } from '@aphro/runtime-ts';
import { destroyDb, initDb } from './testBase.js';
import domain from '@aphro/integration-tests-shared';

const { UserMutations } = domain.sql;
const { User } = domain.sql;
const { DeckMutations } = domain.sql;
const { SlideMutations } = domain.sql;
const { ComponentMutations } = domain.sql;

const { User: UserMem } = domain.mem;
const { UserMutations: UserMutationsMem } = domain.mem;
const { DeckMutations: DeckMutationsMem } = domain.mem;
const { SlideMutations: SlideMutationsMem } = domain.mem;
const { ComponentMutations: ComponentMutationsMem } = domain.mem;

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
  // TODO: this is simpler if done within a declared mutation.
  // But.. if someone doesn't want to declare a mutation and wants to wire it all on the outside
  // how can we make this easier?
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
    userCs[0],
    componentCs[0],
    slideCs[0],
    deckCs[0],
    ...userCs.slice(1),
    ...componentCs.slice(1),
    ...slideCs.slice(1),
    ...deckCs.slice(1),
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
