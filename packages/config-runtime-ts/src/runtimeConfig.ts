import { nullthrows } from '@strut/utils';
import { DBResolver } from './DBResolver.js';

let resolver: DBResolver;
const config = {
  set resolver(r: DBResolver) {
    resolver = r;
  },

  get resolver(): DBResolver {
    return nullthrows(resolver);
  },
};

export default config;
