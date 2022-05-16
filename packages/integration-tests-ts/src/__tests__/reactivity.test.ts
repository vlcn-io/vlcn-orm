import { destroyDb, initDb } from './testBase.js';

beforeAll(async () => {
  await initDb();
});

test('Model subscription', async () => {});
test('Query all subscription', async () => {});
test('Filtered query subscription', async () => {});
test('Hop query subscription', async () => {});

afterAll(async () => {
  await destroyDb();
});
