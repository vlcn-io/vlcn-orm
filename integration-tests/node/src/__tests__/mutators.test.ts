import {
  Context,
  context,
  viewer,
  commit,
  CreateMutationBuilder,
  asId,
  sid,
  Cache,
  SID_of,
  P,
} from '@aphro/runtime-ts';
import domain from '@aphro/integration-tests-shared';

const { UserQuery, UserSpec: spec, Foo } = domain.sql;

import { destroyDb, initDb } from './testBase.js';
const device = 'aaaa';

let ctx: Context;
beforeAll(async () => {
  const resolver = await initDb();
  ctx = context(viewer(asId('me')), resolver, new Cache());
});

test('Creating models via mutators', () => {
  const cs = new CreateMutationBuilder(ctx, spec)
    .set({
      id: sid(device),
      created: Date.now(),
      modified: Date.now(),
      name: 'Bart',
    })
    .toChangesets();

  expect(async () => {
    await commit(ctx, cs);
  }).not.toThrow();
});

test('Optimstic read after create', async () => {
  const creationTime = Date.now();
  const cs = new CreateMutationBuilder(ctx, spec)
    .set({
      id: sid(device),
      created: creationTime,
      modified: creationTime,
      name: 'Bart',
    })
    .toChangesets();

  const user = await commit(ctx, cs[0]);

  expect(user.name).toEqual('Bart');
  expect(user.created).toEqual(creationTime);
  expect(user.modified).toEqual(creationTime);
});

test('Reading the created item after create', async () => {
  const creationTime = Date.now();
  const cs = new CreateMutationBuilder(ctx, spec)
    .set({
      id: sid(device),
      created: creationTime,
      modified: creationTime,
      name: 'Bart',
    })
    .toChangesets()[0];

  const user = await commit(ctx, cs);

  // TODO: generate static User.queryAll method
  let users = await UserQuery.create(ctx).gen();
  expect(users).toContain(user);

  ctx.cache.clear();
  users = await UserQuery.create(ctx).gen();
  expect(users.map(u => u.id)).toContain(cs.id);
  expect(users).not.toContain(user);
});

test('shorthand create', async () => {
  for (let i = 0; i < 100; ++i) {
    const id = sid(device);
    const user = Foo.create(ctx, {
      id: asId(id),
      name: 'Bart',
    }).save().optimistic;

    expect(user.id).toBe(id);
  }
});

test('shorthand update', async () => {
  const creationTime = Date.now();

  const createdUsers = await Promise.all(
    Array.from({ length: 100 }).map(_ =>
      Foo.create(ctx, {
        id: sid(device),
        name: 'Bart',
      }).save(),
    ),
  );

  // console.log(createdUsers);

  // TODO: In practice we should batch into changesets.
  // Well... actually... in practice we can use `dataLoader` to collect
  // all writes into a single batch (https://github.com/graphql/dataloader).
  // This'll protect the developer from using inefficient patterns and hide the need to know about
  // batching changesets altogether.
  const updatedUsers = await Promise.all(
    createdUsers.map((u, i) =>
      u
        .update({
          name: 'shorthand-update-' + i,
        })
        .save(),
    ),
  );

  updatedUsers.forEach((u, i) => expect(u.name).toBe('shorthand-update-' + i));

  // They should both be fulfilled from the cache and thus be the same instances
  expect(updatedUsers).toEqual(createdUsers);

  // TODO: we should nuke the db between tests so this only contains rows for our test
  let queriedUsers = await Foo.queryAll(ctx).whereName(P.startsWith('shorthand-update-')).gen();

  // queries should returned cached users if they exists -- which they do since we just created what we're querying for.
  updatedUsers.forEach(u => expect(queriedUsers).toContain(u));

  ctx.cache.clear();
  // // Since we nuked the cache the instances returned from the db should be _new_ user instances
  // // that do not match what we have loaded
  queriedUsers = await Foo.queryAll(ctx).whereName(P.startsWith('shorthand-update-')).gen();
  updatedUsers.forEach(u => expect(queriedUsers).not.toContain(u));
});

afterAll(async () => {
  await destroyDb();
});
