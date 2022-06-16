import {
  Context,
  context,
  viewer,
  commit,
  CreateMutationBuilder,
  asId,
  sid,
  Cache,
} from '@aphro/runtime-ts';
import spec from '../generated/UserSpec.js';
import { destroyDb, initDb } from './testBase.js';
import UserQuery from '../generated/UserQuery.js';
const device = 'aaaa';

let ctx: Context;
beforeAll(async () => {
  const resolver = await initDb();
  ctx = context(viewer(asId('me')), resolver, new Cache());
});

test('Creating models via mutators', () => {
  // TODO: create simple API for people that want to use mutation builders directly?
  // create(spec, updates).toChangeset/.commit | Or force everyone onto generated Mutations?
  const cs = new CreateMutationBuilder(spec)
    .set({
      id: sid(device),
      created: Date.now(),
      modified: Date.now(),
      name: 'Bart',
    })
    .toChangeset();

  expect(async () => {
    const [persist, optimistic] = commit(ctx, [cs]);
    await persist;
  }).not.toThrow();
});

test('Optimstic read after create', async () => {
  const creationTime = Date.now();
  const cs = new CreateMutationBuilder(spec)
    .set({
      id: sid(device),
      created: creationTime,
      modified: creationTime,
      name: 'Bart',
    })
    .toChangeset();

  const [persist, user] = commit(ctx, [cs]);

  expect(user.name).toEqual('Bart');
  expect(user.created).toEqual(creationTime);
  expect(user.modified).toEqual(creationTime);

  await persist;
});

test('Reading the created item after create', async () => {
  const creationTime = Date.now();
  const cs = new CreateMutationBuilder(spec)
    .set({
      id: sid(device),
      created: creationTime,
      modified: creationTime,
      name: 'Bart',
    })
    .toChangeset();

  const [persist, optimistic] = commit(ctx, [cs]);
  await persist;

  // TODO: generate static User.queryAll method
  let users = await UserQuery.create(ctx).gen();
  expect(users).toContain(optimistic);

  ctx.cache.clear();
  users = await UserQuery.create(ctx).gen();
  expect(users.map(u => u.id)).toContain(cs.id);
  expect(users).not.toContain(optimistic);
});

afterAll(async () => {
  await destroyDb();
});
