import Employee from '../generated/Employee';
import Artist from '../generated/Artist';
import Album from '../generated/Album';
import setup from './setup';

const ctx = setup();

test('Query random things', async () => {
  const employees = await Employee.queryAll(ctx).gen();
  const artists = await Artist.queryAll(ctx).gen();
  const albums = await Album.queryAll(ctx).gen();

  expect((await Employee.queryAll(ctx).gen()).length).toBeGreaterThan(0);
  expect((await Artist.queryAll(ctx).gen()).length).toBeGreaterThan(0);
  expect((await Album.queryAll(ctx).gen()).length).toBeGreaterThan(0);
});
