import { readdirSync, readFileSync } from 'fs';
import { resolvers } from './generated/domain.graphql-resolvers.js';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { createServer } from '@graphql-yoga/node';
import { context, anonymous, Context, basicResolver } from '@aphro/runtime-ts';
import connect, { DatabaseConnection, sql } from '@databases/sqlite';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const typedefs = readFileSync('./dist/generated/domain.graphql', { encoding: 'utf8' });
const DB_FILE = './dist/db.db';

const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typedefs],
});

async function main() {
  const db = connect(DB_FILE);
  await createTables(db);

  const ctx = context(anonymous(), basicResolver(db));

  await createTestData(ctx);

  const server = createServer({ schema, context: { aphrodite: ctx } });
  await server.start();
}

async function createTables(db: DatabaseConnection) {
  const generatedDir = path.join(__dirname, 'generated');
  const schemaPaths = readdirSync(generatedDir).filter(name => name.endsWith('.sqlite.sql'));

  const schemas = schemaPaths.map(s => sql.file(path.join(generatedDir, s)));

  await Promise.all(schemas.map(s => db.query(s)));
}

async function createTestData(ctx: Context) {}

main();
