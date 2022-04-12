import sid from '@strut/sid';
import SlideQuery from '../generated/SlideQuery.js';

/**
 * Now that everything generates correctly...
 * lets try creating some queries and inspecting their plans.
 */

test('Query from id', async () => {
  const plan = SlideQuery.fromId(sid('foo')).plan();
  const result = await plan.iterable.gen();
  console.log(result);
});
