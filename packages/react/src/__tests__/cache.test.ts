import { QueryCache } from '../hooks.js';

test('evicts at size limit', () => {
  const cache = new QueryCache(2);

  for (let i = 0; i < 10; ++i) {
    cache.set(i + '', []);
    expect(cache.size).toBeLessThanOrEqual(2);
  }
});
