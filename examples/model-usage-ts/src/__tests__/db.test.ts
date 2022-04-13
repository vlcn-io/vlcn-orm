import { create } from '../db';

let db: ReturnType<typeof create>;
beforeAll(() => {
  db = create();
});

test('spinning up the db', async () => {
  const resp = await db.raw(`SELECT name FROM sqlite_schema WHERE type='table' ORDER BY name`);
  expect(resp).toEqual([]); // nothing in the db yet.
});

afterAll(() => {
  db.destroy();
});
