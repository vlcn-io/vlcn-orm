import { asId, Context, context, viewer } from '@aphro/runtime-ts';
import domain from '@aphro/integration-tests-shared';
const { User } = domain.sql;
const { User: UserMem } = domain.mem;
import createGraph from './createGraph.js';
import { destroyDb, initDb } from './testBase.js';

let ctx: Context;
beforeAll(async () => {
  const resolver = await initDb();
  ctx = context(viewer(asId('me')), resolver);
  await createGraph(ctx);
});

// Note: "where(lambda)" can never be hoisted
// and thus should rarely, if ever, be used.
test('Where lambda', async () => {
  const [u1sql, u1mem] = await Promise.all([
    User.queryAll(ctx)
      .where(u => u.name === 'U1')
      .genxOnlyValue(),
    UserMem.queryAll(ctx)
      .where(u => u.name === 'U1')
      .genxOnlyValue(),
  ]);

  expect(u1sql.name).toEqual('U1');
  expect(u1mem.name).toEqual('U1');
});

test('Map', async () => {
  const [sqlNames, memNames] = await Promise.all([
    User.queryAll(ctx)
      .orderByName()
      .map(u => u.name)
      .gen(),
    UserMem.queryAll(ctx)
      .orderByName()
      .map(u => u.name)
      .gen(),
  ]);

  expect(sqlNames).toEqual(['U1', 'U2', 'U3', 'U4']);
  expect(memNames).toEqual(['U1', 'U2', 'U3', 'U4']);
});

test('Where lambda async', async () => {
  const [u1sql, u1mem] = await Promise.all([
    User.queryAll(ctx)
      .whereAsync(async u => u.name === 'U1')
      .genxOnlyValue(),
    UserMem.queryAll(ctx)
      .whereAsync(async u => u.name === 'U1')
      .genxOnlyValue(),
  ]);

  expect(u1sql.name).toEqual('U1');
  expect(u1mem.name).toEqual('U1');
});
test('Map async', async () => {
  const [sqlNames, memNames] = await Promise.all([
    User.queryAll(ctx)
      .orderByName()
      .mapAsync(async u => u.name)
      .gen(),
    UserMem.queryAll(ctx)
      .orderByName()
      .mapAsync(async u => u.name)
      .gen(),
  ]);

  expect(sqlNames).toEqual(['U1', 'U2', 'U3', 'U4']);
  expect(memNames).toEqual(['U1', 'U2', 'U3', 'U4']);
});

test('lambda orderby', async () => {
  const [sql, mem] = await Promise.all([
    User.queryAll(ctx)
      .orderBy((l, r) => parseInt(r.name[1]) - parseInt(l.name[1]))
      .gen(),
    UserMem.queryAll(ctx)
      .orderBy((l, r) => parseInt(r.name[1]) - parseInt(l.name[1]))
      .gen(),
  ]);

  expect(sql.map(u => u.name)).toEqual(['U4', 'U3', 'U2', 'U1']);
  expect(mem.map(u => u.name)).toEqual(['U4', 'U3', 'U2', 'U1']);
});

afterAll(async () => {
  await destroyDb();
});
