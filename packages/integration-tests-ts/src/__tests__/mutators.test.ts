import { Context } from '@aphro/context-runtime-ts';
import { context } from '@aphro/context-runtime-ts';
import { viewer } from '@aphro/context-runtime-ts';
import { commit, CreateMutationBuilder } from '@aphro/mutator-runtime-ts';
import sid, { asId } from '@strut/sid';
import spec from '../generated/UserSpec.js';
import { destroyDb, initDb } from './testBase.js';
import Cache from '@aphro/cache-runtime-ts';
import User from '../generated/User.js';
import UserQuery from '../generated/UserQuery.js';
const device = 'sdf';

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
    const [optimistic, persist] = commit(ctx, [cs]);
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

  const [optimistic, persist] = commit(ctx, [cs]);

  const user = optimistic.nodes.getx(cs.id);
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

  const [optimistic, persist] = commit(ctx, [cs]);
  await persist;

  // TODO: generate static User.queryAll method
  let users = await UserQuery.create(ctx).gen();
  expect(users).toContain(optimistic.nodes.getx(cs.id));

  ctx.cache.clear();
  users = await UserQuery.create(ctx).gen();
  expect(users.map(u => u.id)).toContain(cs.id);
  expect(users).not.toContain(optimistic.nodes.getx(cs.id));
});

afterAll(async () => {
  await destroyDb();
});
