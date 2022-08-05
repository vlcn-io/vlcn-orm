import Employee from '../domain/Employee';
import Artist from '../domain/Artist';
import Album from '../domain/Album';
import setup from './setup';

const ctx = setup();

test('Query random things', async () => {
  const [managers, artists, albums, supported] = await Promise.all([
    Employee.queryAll(ctx).queryReportsTo().gen(),
    Artist.queryAll(ctx).gen(),
    Album.queryAll(ctx).gen(),
    Employee.queryAll(ctx).querySupports().gen(),
  ]);

  expect(managers.length).toBeGreaterThan(0);
  expect(artists.length).toBeGreaterThan(0);
  expect(albums.length).toBeGreaterThan(0);
  expect(supported.length).toBeGreaterThan(0);
});
