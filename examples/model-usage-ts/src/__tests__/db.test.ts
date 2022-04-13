import db from '../db';

test('spinning up the db', () => {
  db.migrate.latest();
});
