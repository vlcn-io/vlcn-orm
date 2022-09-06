import { resolver } from './testdb.js';
import { bootstrap } from '@aphro/runtime-ts';
import { sqlFiles } from '@aphro/integration-tests-shared';

export default async function createTestTables() {
  await bootstrap.createThrowIfExists(resolver, sqlFiles);
}
