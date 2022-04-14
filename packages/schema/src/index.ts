export { default as compile, compileFromString } from './compile.js';
export { stopsCodegen } from './validate.js';
export { default as nodeFn } from './node.js';
export { default as edgeFn } from './edge.js';
export { default as fieldFn } from './field.js';
export * from './module.js';
import { GrammarExtension } from '@aphro/grammar-extension-api';

export function congiure({ extensions }: { extensions: GrammarExtension<any, any>[] }) {
  // Augment our parser with the provided grammar extensions
}
