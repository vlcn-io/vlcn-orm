import { context, Context, viewer, Cache, asId, commit, DBResolver } from '@aphro/runtime-ts';
import { destroyDb, initDb } from './testBase.js';
import domain from '@aphro/integration-tests-shared';

const { DeckMutations, Deck, User, UserMutations, DeckToEditorsEdgeMutations } = domain.sql;

// TODO: figure out how we can migrate all this to property based test (e.g., fast check)
// e.g., apply all predicates
// filter against a variety of values

let ctx: Context;
const cache = new Cache();

let deck: InstanceType<typeof Deck>;
let owner: InstanceType<typeof User>;
let editors: InstanceType<typeof User>[];
let rh: DBResolver;
beforeAll(async () => {
  const resolver = await initDb();
  rh = resolver;
  ctx = context(viewer(asId('me')), resolver, cache);

  const userCs = [1, 2, 3, 4].flatMap(i =>
    UserMutations.create(ctx, { name: 'U' + i }).toChangesets(),
  );
  const deckCs = DeckMutations.create(ctx, {
    name: 'Preso',
    owner: userCs[0],
    selectedSlide: null,
  }).toChangesets();
  const editorCs = userCs.slice(1).flatMap(u =>
    DeckToEditorsEdgeMutations.create(ctx, {
      src: deckCs[0],
      dest: u,
    }).toChangesets(),
  );

  const [u1, u2, u3, u4, d] = await commit(ctx, ...userCs, ...deckCs, ...editorCs);

  owner = u1 as InstanceType<typeof User>;
  deck = d as InstanceType<typeof Deck>;
  editors = [u2, u3, u4] as InstanceType<typeof User>[];
});

test('link up a slide deck and users through a junction edge and query', async () => {
  const queriedEditors = await owner.queryDecks().queryEditors().gen();
  expect(queriedEditors.map(e => e.name).sort()).toEqual(editors.map(e => e.name).sort());
});

test('junction hops are optimized', async () => {
  const plan = owner.queryDecks().queryEditors().plan().optimize();
  expect(plan.derivations.length).toBe(1);
  expect(plan.derivations[0].type).toEqual('modelLoad');
});

afterAll(async () => {
  await destroyDb();
});
