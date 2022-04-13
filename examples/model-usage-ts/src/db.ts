import knex from 'knex';
import knexfile from '../knexfile';

export function create() {
  if (process.env.NODE_ENV === 'test') {
    return knex(knexfile.test);
  } else {
    throw new Error('Only available in test mode at the moment');
  }
}
