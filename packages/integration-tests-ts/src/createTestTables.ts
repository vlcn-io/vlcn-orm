// TODO: extract this to a testing package?
import * as path from 'path';
import * as fs from 'fs';
import { resolver } from './testdb.js';

export default async function createTestTables() {
  const generatedDir = path.join(__dirname, '..', 'src', 'generated');
  const schemaPaths = fs.readdirSync(generatedDir).filter(name => name.endsWith('.sqlite.sql'));

  const schemas = await Promise.all(
    schemaPaths.map(s => fs.promises.readFile(path.join(generatedDir, s), { encoding: 'utf8' })),
  );

  const db = resolver.type('sql').engine('sqlite').db('test');
  await Promise.all(schemas.map(s => db.raw(s)));
}
