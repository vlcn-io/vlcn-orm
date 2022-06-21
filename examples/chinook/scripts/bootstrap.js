import connect, { sql } from '@databases/sqlite';
import fs from 'fs';
import path from 'path';

const db = connect('./db/chinook.sqlite');

async function createTables() {
  const generatedDir = path.join('.', 'src', 'generated');
  const schemaPaths = fs.readdirSync(generatedDir).filter(name => name.endsWith('.sqlite.sql'));

  const schemas = schemaPaths.map(s => sql.file(path.join(generatedDir, s)));
  await Promise.all(schemas.map(s => db.query(s)));
}

await createTables();

// use `npm run bootstrap` -- seeding is done via cat rather than in this script at the moment.
