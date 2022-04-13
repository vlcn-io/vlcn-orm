export default {
  test: {
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
  },
};

// example:
// knex --env test migrate:make create_user_table
