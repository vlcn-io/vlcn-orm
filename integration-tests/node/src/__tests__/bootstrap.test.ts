import { resolver } from '../testdb.js';
import { sqlFiles } from '@aphro/integration-tests-shared';
import { bootstrap, sql } from '@aphro/runtime-ts';

// test('creating tables that do not exist', async () => {
//   await bootstrap.createIfNotExists(resolver, sqlFiles);
// });

test('creating tables that do exist', async () => {
  await bootstrap.createIfNotExists(resolver, sqlFiles);
  await bootstrap.createIfNotExists(resolver, sqlFiles);

  let threw = false;
  try {
    await bootstrap.createThrowIfExists(resolver, sqlFiles);
  } catch (e) {
    threw = true;
  }
  expect(threw).toBe(true);
  // \/ the below is flaky. The above /\ always works 🤷‍♂️
  // expect(async () => {...}).rejects.toThrow();
});

// test('auto-migrate', async () => {
//   // no deltas, be silent
//   // deltas, make a change
//   // require numbering of fields so we can detect renames?
//   await bootstrap.createAutomigrateIfExists(resolver, sqlFiles);
// });
