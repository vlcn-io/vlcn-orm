import { DatabaseConnection, sql } from '@databases/sqlite';
import setupDb from './setupDb';
import fc from 'fast-check';

let db: DatabaseConnection;
beforeAll(async () => {
  db = await setupDb();
});

let id = 0;
test('Inserting many todos', async () => {
  fc.assert(
    fc.asyncProperty(fc.integer(), fc.string(), fc.boolean(), async (listId, text, completed) => {
      // we're really just testing that nothing throws.
      let threw = false;
      try {
        await db.query(createInsert(++id, listId, text, completed));
      } catch (e) {
        threw = true;
        console.error(e);
        throw e;
      } finally {
        expect(threw).toBe(false);
      }
    }),
  );
});

function createInsert(id, listId, text, completed) {
  return sql`INSERT INTO todo (id, listId, text, completed) VALUES (${sql.value(id)}, ${sql.value(
    listId,
  )}, ${sql.value(text)}, ${sql.value(completed)})`;
}
