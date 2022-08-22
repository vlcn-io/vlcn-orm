import connect, { sql } from '@databases/sqlite';
import { anonymous, basicResolver, context } from '@aphro/runtime-ts';
import { fileURLToPath } from 'url';
import * as path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function setup() {
  const db = connect(__dirname + '/../../db/chinook.sqlite');
  return context(anonymous(), basicResolver('chinook', db));
}
