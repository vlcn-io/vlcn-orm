// TODO: extract this to a testing package?
import * as path from 'path';
import * as fs from 'fs';
import { create as createDb } from './db.js';

export default async function createTestTables(db: ReturnType<typeof createDb>) {
  const generatedDir = path.join(__dirname, '..', 'src', 'example', 'generated');
  const schemaPaths = fs.readdirSync(generatedDir).filter(name => name.endsWith('.lite.sql'));

  const schemas = await Promise.all(
    schemaPaths.map(s => fs.promises.readFile(path.join(generatedDir, s), { encoding: 'utf8' })),
  );
  await Promise.all(schemas.map(s => db.raw(s)));
}
