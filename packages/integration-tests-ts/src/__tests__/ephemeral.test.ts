import { asId, Cache, context, Context, noStorageResolver, viewer } from '@aphro/runtime-ts';
import AppStateMutations from '../generated/generated/AppStateMutations';
import IdentityMutations from '../generated/generated/IdentityMutations';
import { jest } from '@jest/globals';

jest.useFakeTimers();
let ctx: Context;
let cache: Cache;

beforeAll(async () => {
  cache = new Cache();
  ctx = context(viewer(asId('me')), noStorageResolver, cache);

  // const s = new AppState(ctx, {
  //   id: asId('123'),
  //   openDeckId: asId('12345'),
  //   identity: new Identity(ctx, {
  //     id: asId('1234'),
  //     identifier: 'sdf',
  //     token: 'sdf',
  //   }),
  // });
});

test('Ephemeral nodes are not added to the cache on create', () => {
  IdentityMutations.create(ctx, {
    identifier: 'foo@foo.com',
    token: 'sdfsdfds',
  }).save().optimistic;

  expect(cache.size).toBe(0);
});

test('Ephemeral nodes are not added to the cache on update', () => {
  const identity = IdentityMutations.create(ctx, {
    identifier: 'foo@foo.com',
    token: 'sdfsdfds',
  }).save().optimistic;

  let appState = AppStateMutations.create(ctx, {
    identity: identity,
    openDeckId: asId('a'),
  }).save().optimistic;

  expect(cache.size).toBe(0);

  appState = appState.mutations.openDeck({ openDeck: asId('b') }).save0();

  expect(cache.size).toBe(0);
});

test('Changes to ephemeral nodes can be observed', () => {
  let identity = IdentityMutations.create(ctx, {
    identifier: 'foo@foo.com',
    token: 'sdfsdfds',
  }).save().optimistic;

  let appState = AppStateMutations.create(ctx, {
    identity: identity,
    openDeckId: asId('a'),
  }).save().optimistic;

  let notified = false;
  appState.subscribeTo(['openDeckId'], () => {
    notified = true;
  });

  appState.mutations.openDeck({ openDeck: asId('b') }).save();
  jest.runAllTimers();
  expect(notified).toBe(true);
});
