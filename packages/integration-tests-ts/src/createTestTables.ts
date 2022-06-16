// TODO: extract this to a testing package?
import * as path from 'path';
import * as fs from 'fs';
import { resolver } from './testdb.js';
import { sql } from '@aphro/runtime-ts';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function createTestTables() {
  const generatedDir = path.join(__dirname, '..', 'src', 'generated');
  const schemaPaths = fs.readdirSync(generatedDir).filter(name => name.endsWith('.sqlite.sql'));

  const schemas = schemaPaths.map(s => sql.file(path.join(generatedDir, s)));

  const db = resolver.engine('sqlite').db('test');
  await Promise.all(schemas.map(s => db.query(s)));
}
