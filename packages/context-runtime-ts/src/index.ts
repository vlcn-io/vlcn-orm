import { DBResolver } from './DBResolver';
import runtimeConfig from './runtimeConfig.js';

export * from './DBResolver';

export function configure({ resolver }: { resolver: DBResolver }) {
  runtimeConfig.resolver = resolver;
}

export const __internalConfig = runtimeConfig;
