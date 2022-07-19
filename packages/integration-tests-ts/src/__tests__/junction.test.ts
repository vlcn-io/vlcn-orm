import {
  context,
  Context,
  viewer,
  Cache,
  asId,
  commit,
  P,
  DBResolver,
  sql,
} from '@aphro/runtime-ts';
import { destroyDb, initDb } from './testBase.js';
import UserMutations from '../generated/generated//UserMutations';
import User from '../generated/User.js';
import DeckMutations from '../generated/generated/DeckMutations.js';
import DeckToEditorsEdgeMutations from '../generated/generated/DeckToEditorsEdgeMutations.js';
import Deck from '../generated/Deck.js';

// TODO: figure out how we can migrate all this to property based test (e.g., fast check)
// e.g., apply all predicates
// filter against a variety of values

let ctx: Context;
const cache = new Cache();

let deck: Deck;
let owner: User;
let editors: User[];
let rh: DBResolver;
beforeAll(async () => {
  const resolver = await initDb();
  rh = resolver;
  ctx = context(viewer(asId('me')), resolver, cache);

  const userCs = [1, 2, 3, 4].map(i => UserMutations.create(ctx, { name: 'U' + i }).toChangeset());
  const deckCs = DeckMutations.create(ctx, {
    name: 'Preso',
    owner: userCs[0],
    selectedSlide: null,
  }).toChangeset();
  const editorCs = userCs.slice(1).map(u =>
    DeckToEditorsEdgeMutations.create(ctx, {
      src: deckCs,
      dest: u,
    }).toChangeset(),
  );

  const [u1, u2, u3, u4, d] = await commit(ctx, ...userCs, deckCs, ...editorCs);

  owner = u1 as User;
  deck = d as Deck;
  editors = [u2, u3, u4] as User[];
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
