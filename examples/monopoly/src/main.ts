import { readFileSync } from 'fs';
import { resolvers } from './generated/domain.graphql-resolvers.js';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { createServer } from '@graphql-yoga/node';
import { context, anonymous, basicResolver, SQLQuery } from '@aphro/runtime-ts';
import connect from '@databases/sqlite';

const typedefs = readFileSync('./dist/generated/domain.graphql', { encoding: 'utf8' });
const DB_FILE = './dist/db.db';

const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typedefs],
});

async function main() {
  const db = connect(DB_FILE);

  // TODO: just support `@databases` db connection directly?
  const ctx = context(
    anonymous(),
    basicResolver({
      type: 'sql',
      exec(q: SQLQuery) {
        return db.query(q);
      },
      destroy() {
        db.dispose();
      },
    }),
  );

  const server = createServer({ schema, context: { aphrodite: ctx } });
  await server.start();
}

main();
