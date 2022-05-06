import Cache from '../Cache.js';
import { Model } from '@aphro/model-runtime-ts';
import { SID_of } from '@strut/sid';

test('set and get', () => {
  const cache = new Cache();

  const model = new Model({});
  const id = 'sdf' as SID_of<Model<{}>>;
  cache.set(id, model);
  expect(cache.get(id)).toBe(model);

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
