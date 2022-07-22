import { DatabaseConnection, sql, SQLQuery } from '@databases/sqlite';
import setupDb from './setupDb';
import fc from 'fast-check';
import createInsert from './createInsert';
import { currentClockQuery } from './replicate';

let dbA: DatabaseConnection;
let dbB: DatabaseConnection;
let dbC: DatabaseConnection;
beforeAll(async () => {
  [dbA, dbB, dbC] = await Promise.all([setupDb(), setupDb(), setupDb()]);
});
afterAll(() => {
  dbA.dispose();
  dbB.dispose();
  dbC.dispose();
});

let id = 0;
test('Discovering deltas between diverging datasets', async () => {
  // Start all dbs off at identical states
  await fc.assert(
    fc.asyncProperty(fc.integer(), fc.string(), fc.boolean(), async (listId, text, completed) => {
      const insert = createInsert(++id, listId, text, completed);
      await Promise.all([dbA.query(insert), dbB.query(insert), dbC.query(insert)]);
    }),
  );

  // Check vector clocks of A, B, C
  const [aClocks, bClocks, cClocks] = (await onAll(currentClockQuery('todo'))).map(c =>
    c.reduce((l, r) => {
      l[r.peerId] = r.version;
      return l;
    }, {}),
  );

  console.log(aClocks);
  console.log(bClocks);
  console.log(cClocks);

  // get the wire representation of the clocks

  // Make changes on A
  // Merge them into B
  // Merge B into C
  // Check that A, B, C are equivalent
});

async function onAll(query: SQLQuery): Promise<[any[], any[], any[]]> {
  return await Promise.all([dbA.query(query), dbB.query(query), dbC.query(query)]);
}
