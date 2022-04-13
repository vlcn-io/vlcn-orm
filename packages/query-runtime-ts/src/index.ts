import { nullthrows } from '@strut/utils';
import { DBResolver } from 'resolver/DBResolver.js';

export { default as P, Predicate } from './Predicate.js';
export { DerivedQuery } from './Query.js';
export { default as QueryFactory } from './QueryFactory.js';
export * from './Expression.js';
export * from './Field.js';
export * from './resolver/DBResolver.js';

// configure the runtime by injecting it with a db resolver.
let dbResolver: DBResolver;
export function configure({ resolver }: { resolver: DBResolver }) {
  dbResolver = resolver;
}

export function getResolver() {
  return nullthrows(dbResolver);
}
