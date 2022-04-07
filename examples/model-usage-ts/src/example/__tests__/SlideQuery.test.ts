import sid from '@strut/sid';
import SlideQuery from '../generated/SlideQuery.js';

/**
 * Now that everything generates correctly...
 * lets try creating some queries and inspecting their plans.
 */

test('Query from id', () => {
  const plan = SlideQuery.fromId(sid('foo')).plan();
  console.log(plan);
  console.log(plan.optimize());
});
