import { resolver } from './testdb.js';
import { bootstrap } from '@aphro/runtime-ts';
import sqlFiles from './generated/generated/exports-node-sql.js';

export default async function createTestTables() {
  await bootstrap.createThrowIfExists(resolver, sqlFiles);
}
