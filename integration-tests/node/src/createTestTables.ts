import { resolver } from './testdb.js';
import { bootstrap } from '@aphro/runtime-ts';
import sqlFiles from './domain/generated/exports-node-sql.js';

export default async function createTestTables() {
  await bootstrap.createThrowIfExists(resolver, sqlFiles);
}
