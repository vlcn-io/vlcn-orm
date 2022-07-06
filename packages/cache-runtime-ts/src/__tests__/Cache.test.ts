import Cache from '../cache.js';
import { asId, SID_of } from '@strut/sid';
import fc from 'fast-check';

// TODO: cache will need to be per viewer......
// Why would we have many viewers in local first P2P app? For privacy respecting replications to other peers.
// To do that, we try to "load" the model as the other peer. If success, we allow the replication.
class TestModel {
  readonly id;

  constructor(id: SID_of<TestModel>) {
    this.id = id;
  }
}

test('get should always return what was just set', () => {
  fc.assert(
    fc.property(fc.string(), id => {
      const cache = new Cache();
      let casted = asId<TestModel>(id);
      const model = new TestModel(casted);
      cache.set(casted, model);
      expect(cache.get(casted, model.constructor.name)).toBe(model);
    }),
  );
});

test('set should throw if we set an existing entry to a new instance', () => {
  const cache = new Cache();
  const id = asId<TestModel>('b');
  const model = new TestModel(id);

  cache.set(id, model);
  expect(() => cache.set(id, new TestModel(id))).toThrow();
  expect(() => cache.set(id, model)).not.toThrow();
});

test('items are removed', () => {
  const cache = new Cache();
  const id = asId<TestModel>('z');
  const model = new TestModel(id);
  cache.set(id, model);
  cache.remove(id, model.constructor.name);
  expect(cache.get(id, model.constructor.name)).toBe(null);
});

test('destruct', () => {
  const cache = new Cache();
  const id = asId<TestModel>('a');
  const model = new TestModel(id);
  cache.set(id, model);
  cache.clear();
  expect(cache.get(id, model.constructor.name)).toBe(null);
});

// test garbage collect?
