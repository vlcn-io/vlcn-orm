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
import spec from '../generated/UserSpec.js';
import { destroyDb, initDb } from './testBase.js';
import UserQuery from '../generated/UserQuery.js';
import User from '../generated/User.js';
const device = 'aaaa';

let ctx: Context;
beforeAll(async () => {
  const resolver = await initDb();
  ctx = context(viewer(asId('me')), resolver, new Cache());
});

// test('Creating models via mutators', () => {
//   // TODO: create simple API for people that want to use mutation builders directly?
//   // create(spec, updates).toChangeset/.commit | Or force everyone onto generated Mutations?
//   const cs = new CreateMutationBuilder(ctx, spec)
//     .set({
//       id: sid(device),
//       created: Date.now(),
//       modified: Date.now(),
//       name: 'Bart',
//     })
//     .toChangeset();

//   expect(async () => {
//     const [persist, optimistic] = commit(ctx, [cs]);
//     await persist;
//   }).not.toThrow();
// });

// test('Optimstic read after create', async () => {
//   const creationTime = Date.now();
//   const cs = new CreateMutationBuilder(ctx, spec)
//     .set({
//       id: sid(device),
//       created: creationTime,
//       modified: creationTime,
//       name: 'Bart',
//     })
//     .toChangeset();

//   const [persist, user] = commit(ctx, [cs]);

//   expect(user.name).toEqual('Bart');
//   expect(user.created).toEqual(creationTime);
//   expect(user.modified).toEqual(creationTime);

//   await persist;
// });

// test('Reading the created item after create', async () => {
//   const creationTime = Date.now();
//   const cs = new CreateMutationBuilder(ctx, spec)
//     .set({
//       id: sid(device),
//       created: creationTime,
//       modified: creationTime,
//       name: 'Bart',
//     })
//     .toChangeset();

//   const [persist, optimistic] = commit(ctx, [cs]);
//   await persist;

//   // TODO: generate static User.queryAll method
//   let users = await UserQuery.create(ctx).gen();
//   expect(users).toContain(optimistic);

//   ctx.cache.clear();
//   users = await UserQuery.create(ctx).gen();
//   expect(users.map(u => u.id)).toContain(cs.id);
//   expect(users).not.toContain(optimistic);
// });

// test('shorthand create', async () => {
//   const creationTime = Date.now();
//   for (let i = 0; i < 100; ++i) {
//     const id = sid(device);
//     const user = new CreateMutationBuilder(ctx, spec)
//       .set({
//         id: id as SID_of<User>,
//         created: creationTime,
//         modified: creationTime,
//         name: 'Bart',
//       })
//       .save();

//     expect(user.id).toBe(id);
//   }
// });

test('shorthand update', async () => {
  const creationTime = Date.now();
  const createResults: [Promise<void>, User][] = [];
  for (let i = 0; i < 100; ++i) {
    const id = sid(device);
    createResults.push(
      new CreateMutationBuilder(ctx, spec)
        .set({
          id: id as SID_of<User>,
          created: creationTime,
          modified: creationTime,
          name: 'Bart',
        })
        .saveAwait(),
    );
  }

  const users = createResults.map(c => c[1]);
  await Promise.all(createResults.map(cr => cr[0]));

  // TODO: In practice we should batch into changesets.
  // Well... actually... in practice we can use `dataLoader` to collect
  // all writes into a single batch (https://github.com/graphql/dataloader).
  // This'll protect the developer from using inefficient patterns and hide the need to know about
  // batching changesets altogether.
  const results = users.map((u, i) =>
    u
      .update({
        name: 'shorthand-update-' + i,
      })
      .saveAwait(),
  );

  results.forEach((r, i) => expect(r[1].name).toBe('shorthand-update-' + i));

  // TODO: sqlite doesn't seem to always finish writing after awaiting all promises 🤔
  await Promise.all(results.map(r => r[0]));

  expect(results.map(r => r[1])).toEqual(users);

  // TODO: we should nuke the db between tests so this only contains rows for our test
  let queriedUsers = await User.queryAll(ctx).whereName(P.startsWith('shorthand-update-')).gen();

  console.log(users.length);
  console.log(queriedUsers.length);
  // queries should returned cached users if they exists -- which they do since we just created what we're querying for.
  users.forEach(u => expect(queriedUsers).toContain(u));

  ctx.cache.clear();
  // // Since we nuked the cache the instances returned from the db should be _new_ user instances
  // // that do not match what we have loaded
  queriedUsers = await User.queryAll(ctx).whereName(P.startsWith('shorthand-update-')).gen();
  users.forEach(u => expect(queriedUsers).not.toContain(u));
});

afterAll(async () => {
  await destroyDb();
});
