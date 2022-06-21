import connect, { sql } from '@databases/sqlite';
import { anonymous, basicResolver, context } from '@aphro/runtime-ts';
import Employee from '../generated/Employee';
import Artist from '../generated/Artist';
import Album from '../generated/Album';
import { fileURLToPath } from 'url';
import * as path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = connect(__dirname + '/../../db/chinook.sqlite');
const ctx = context(anonymous(), basicResolver(db));

test('Query random things', async () => {
  const employees = await Employee.queryAll(ctx).gen();
  const artists = await Artist.queryAll(ctx).gen();
  const albums = await Album.queryAll(ctx).gen();

  await Employee.queryAll(ctx).gen();
  await Artist.queryAll(ctx).gen();
  await Album.queryAll(ctx).gen();
});
