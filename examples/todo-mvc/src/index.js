import { AbsurdSqlClient } from '@aphro/absurd-sql';
import Knex from 'knex';

const knex = Knex({
  client: AbsurdSqlClient,
  connection: ':memory:',
});

console.log(knex.select(knex.raw(1)).toSQL());
