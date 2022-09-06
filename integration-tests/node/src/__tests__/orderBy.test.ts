import { context, Context, viewer, Cache, asId } from '@aphro/runtime-ts';
import { destroyDb, initDb } from './testBase.js';
import domain from '@aphro/integration-tests-shared';
const { User } = domain.sql;
import createGraph from './createGraph.js';

const { User: MemoryUser } = domain.mem;

let ctx: Context;
const cache = new Cache();
beforeAll(async () => {
  const resolver = await initDb();
  ctx = context(viewer(asId('me')), resolver, cache);

  await createGraph(ctx);
});

test('OrderBy', async () => {
  await Promise.all([testOrderBy(User), testOrderBy(MemoryUser)]);
});

async function testOrderBy(Model: typeof User | typeof MemoryUser) {
  let users = await Model.queryAll(ctx).orderByName().gen();
  expect(users.map(u => u.name)).toEqual([1, 2, 3, 4].map(i => 'U' + i));

  users = await Model.queryAll(ctx).orderByName('desc').gen();
  expect(users.map(u => u.name)).toEqual([4, 3, 2, 1].map(i => 'U' + i));
}

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
