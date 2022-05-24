export * from './CodegenFile.js';
export { default as CodegenStep } from './CodegenStep.js';
import CodegenStep from './CodegenStep.js';
import { Node, Edge } from '@aphro/schema-api';

export type Step = {
  new (dest: string, x: Node | Edge): CodegenStep;
  accepts: (x: Node | Edge) => boolean;
};
