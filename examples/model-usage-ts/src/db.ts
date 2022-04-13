import * as path from 'path';
import knex from 'knex';

const config = {
  test: {
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, 'test-db', 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'test-db', 'seeds'),
    },
  },
};

let db: ReturnType<typeof knex>;
if (process.env.NODE_ENV === 'test') {
  db = knex(config.test);
} else {
  throw new Error('Only available in test mode at the moment');
}

export default db;
