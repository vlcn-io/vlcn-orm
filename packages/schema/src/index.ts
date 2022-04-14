export { default as compile, compileFromString } from './compile.js';
export { stopsCodegen } from './validate.js';
export { default as nodeFn } from './node.js';
export { default as edgeFn } from './edge.js';
export { default as fieldFn } from './field.js';
export * from './module.js';
import { GrammarExtension } from '@aphro/grammar-extension-api';
import config from './runtimeConfig.js';

export function configure({ extensions }: { extensions: GrammarExtension<any, any>[] }) {
  config.extensions = extensions;
}
