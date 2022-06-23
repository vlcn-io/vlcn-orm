import Employee from '../generated/Employee';
import Artist from '../generated/Artist';
import Album from '../generated/Album';
import setup from './setup';

const ctx = setup();

test('Query random things', async () => {
  const employees = await Employee.queryAll(ctx).gen();
  const artists = await Artist.queryAll(ctx).gen();
  const albums = await Album.queryAll(ctx).gen();

  await Employee.queryAll(ctx).gen();
  await Artist.queryAll(ctx).gen();
  await Album.queryAll(ctx).gen();
});
