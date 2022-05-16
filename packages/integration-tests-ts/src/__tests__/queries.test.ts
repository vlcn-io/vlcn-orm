import { destroyDb, initDb } from './testBase.js';

beforeAll(async () => {
  await initDb();
});

test('Point queries', async () => {});
test('Query all', async () => {});
test('Query with filter', async () => {});
test('Hop query', async () => {});

afterAll(async () => {
  await destroyDb();
});
