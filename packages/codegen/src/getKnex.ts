import { StorageEngine } from '@aphro/schema-api';
import knex from 'knex';

export default function getKnex(engine: StorageEngine) {
  switch (engine) {
    case 'mysql':
      return knex({ client: 'mysql' });
    case 'postgres':
      return knex({ client: 'pg' });
  }
}
