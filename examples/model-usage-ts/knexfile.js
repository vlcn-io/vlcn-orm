import * as path from 'path';

export default {
  test: {
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
    migrations: {
      directory: './src/test-db/migrations',
    },
    seeds: {
      directory: './src/test-db/seeds',
    },
  },
};

// example:
// knex --env test migrate:make create_user_table
