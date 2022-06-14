import { readFileSync } from 'fs';
import { resolvers } from './generated/domain.graphql-resolvers.js';

const domain = readFileSync('./generated/domain.graphql', { encoding: 'utf8' });

console.log(domain);
