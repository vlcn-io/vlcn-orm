import { DBResolver } from './DBResolver.js';
import runtimeConfig from './runtimeConfig.js';

export * from './DBResolver.js';
export { default as context } from './context.js';
export * from './context.js';
export * from './viewer.js';

export function configure({ resolver }: { resolver: DBResolver }) {
  runtimeConfig.resolver = resolver;
}

export const __internalConfig = runtimeConfig;
