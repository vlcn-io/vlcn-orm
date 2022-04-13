import knex from 'knex';
import knexfile from '../knexfile';

let db: ReturnType<typeof knex>;
if (process.env.NODE_ENV === 'test') {
  db = knex(knexfile.test);
} else {
  throw new Error('Only available in test mode at the moment');
}

export default db;
