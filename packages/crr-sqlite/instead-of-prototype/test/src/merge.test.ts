import { DatabaseConnection, sql, SQLQuery } from '@databases/sqlite';
import setupDb from './setupDb';
import fc from 'fast-check';
import createInsert from './createInsert';
import { currentClockQuery, deltaQuery } from './replicate';

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
  let [aClock, bClock, cClock] = (await onAll(currentClockQuery('todo'))).map(collapseClock);

  expect(Object.values(aClock).length).toBe(1);
  expect(Object.values(bClock).length).toBe(1);
  expect(Object.values(cClock).length).toBe(1);

  expect(
    Object.values(aClock)[0] === Object.values(bClock)[0] &&
      Object.values(bClock)[0] === Object.values(cClock)[0],
  ).toBe(true);

  // dbs are identical but we never exchanged clocks between dbs.
  // thus the dbs will think they are out of sync.

  // Compute all directions of deltas (we don't need to do this in reality -- just for testing)
  // Since dbs are exact but no clocks were exchanged all deltas should match.
  let [abDeltas, bcDeltas, acDeltas, baDeltas, cbDeltas, caDeltas] = await Promise.all([
    dbA.query(deltaQuery('todo', bClock)),
    dbB.query(deltaQuery('todo', cClock)),
    dbA.query(deltaQuery('todo', cClock)),
    dbB.query(deltaQuery('todo', aClock)),
    dbC.query(deltaQuery('todo', bClock)),
    dbC.query(deltaQuery('todo', aClock)),
  ]);

  // Delta ids... should we return full deltas?
  expect(abDeltas.length).toBe(id);
  expect(abDeltas.map(x => x.id)).toEqual(bcDeltas.map(x => x.id));
  expect(bcDeltas.map(x => x.id)).toEqual(acDeltas.map(x => x.id));
  expect(baDeltas.map(x => x.id)).toEqual(cbDeltas.map(x => x.id));
  expect(cbDeltas.map(x => x.id)).toEqual(caDeltas.map(x => x.id));

  const peerIdA = Object.keys(aClock)[0];
  const peerIdB = Object.keys(bClock)[0];
  const peerIdC = Object.keys(cClock)[0];

  // Force clocks to partiy -- this is not a normal method of interacting with the CRR DB.
  // done for testing so we can test starting at identical databases.
  const combinedClock = {
    ...aClock,
    ...bClock,
    ...cClock,
  };
  await Promise.all(
    Array.from({ length: id }).map(async (_, i) => {
      return await Promise.all([
        dbA.query(
          sql`INSERT INTO "todo_vector_clocks" ("vc_peerId", "vc_version", "vc_todoId") VALUES (${peerIdB}, ${
            i + 1
          }, ${i + 1})`,
        ),
        dbA.query(
          sql`INSERT INTO "todo_vector_clocks" ("vc_peerId", "vc_version", "vc_todoId") VALUES (${peerIdC}, ${
            i + 1
          }, ${i + 1})`,
        ),
        dbB.query(
          sql`INSERT INTO "todo_vector_clocks" ("vc_peerId", "vc_version", "vc_todoId") VALUES (${peerIdA}, ${
            i + 1
          }, ${i + 1})`,
        ),
        dbB.query(
          sql`INSERT INTO "todo_vector_clocks" ("vc_peerId", "vc_version", "vc_todoId") VALUES (${peerIdC}, ${
            i + 1
          }, ${i + 1})`,
        ),
        dbC.query(
          sql`INSERT INTO "todo_vector_clocks" ("vc_peerId", "vc_version", "vc_todoId") VALUES (${peerIdA}, ${
            i + 1
          }, ${i + 1})`,
        ),
        dbC.query(
          sql`INSERT INTO "todo_vector_clocks" ("vc_peerId", "vc_version", "vc_todoId") VALUES (${peerIdB}, ${
            i + 1
          }, ${i + 1})`,
        ),
      ]);
    }),
  );

  // All clocks should now be identical.
  [aClock, bClock, cClock] = (await onAll(currentClockQuery('todo'))).map(collapseClock);
  expect(aClock).toEqual(bClock);
  expect(bClock).toEqual(cClock);
  expect(combinedClock).toEqual(cClock);

  // recompute deltas in all directions. There should be no deltas.
  [abDeltas, bcDeltas, acDeltas, baDeltas, cbDeltas, caDeltas] = await Promise.all([
    dbA.query(deltaQuery('todo', bClock)),
    dbB.query(deltaQuery('todo', cClock)),
    dbA.query(deltaQuery('todo', cClock)),
    dbB.query(deltaQuery('todo', aClock)),
    dbC.query(deltaQuery('todo', bClock)),
    dbC.query(deltaQuery('todo', aClock)),
  ]);

  console.log(abDeltas);

  // ok, now that dbs are identical, start editing them to diverge
  // edit todo-1 on A, replicate it to B the replicate it to C
  // after all these replications, db states should match.

  expect(abDeltas.length).toBe(0);

  // Make changes on A
  // Merge them into B
  // Merge B into C
  // Check that A, B, C are equivalent
});

async function onAll(query: SQLQuery): Promise<[any[], any[], any[]]> {
  return await Promise.all([dbA.query(query), dbB.query(query), dbC.query(query)]);
}

const collapseClock = c =>
  c.reduce((l, r) => {
    l[r.peerId] = r.version;
    return l;
  }, {});
