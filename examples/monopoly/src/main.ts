import { readFileSync } from 'fs';
import { resolvers } from './generated/domain.graphql-resolvers.js';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { createServer } from '@graphql-yoga/node';
import { context, anonymous } from '@aphro/runtime-ts';

const typedefs = readFileSync('./generated/domain.graphql', { encoding: 'utf8' });

const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typedefs],
});

async function main() {
  // const ctx = context(anonymous(), resolver);
  const server = createServer({ schema });
  await server.start();
}

main();
