import Cache from '../Cache.js';
import { Model } from '@aphro/model-runtime-ts';
import { SID_of } from '@strut/sid';
import fc from 'fast-check';

test('get should always return what was just set', () => {
  fc.assert(
    fc.property(fc.string(), id => {
      const cache = new Cache();
      let casted = id as SID_of<Model<{}>>;
      const model = new Model({});
      cache.set(casted, model);
      expect(cache.get(casted)).toBe(model);
      cache.destruct();
    }),
  );
});

test('set should throw if we set an existing entry to a new instance', () => {
  const cache = new Cache();
  const model = new Model({});
  const id = 'sdf' as SID_of<Model<{}>>;
  cache.set(id, model);
  expect(() => cache.set(id, new Model({}))).toThrow();
  expect(() => cache.set(id, model)).not.toThrow();
  cache.destruct();
});

test('remove', () => {
  const cache = new Cache();
  const model = new Model({});
  const id = 'sdf' as SID_of<Model<{}>>;
  cache.set(id, model);
  cache.remove(id);
  expect(cache.get(id)).toBe(null);
  cache.destruct();
});

test('destruct', () => {
  const cache = new Cache();
  const model = new Model({});
  const id = 'sdf' as SID_of<Model<{}>>;
  cache.set(id, model);
  cache.destruct();
  expect(cache.get(id)).toBe(null);
});

// test garbage collect?
