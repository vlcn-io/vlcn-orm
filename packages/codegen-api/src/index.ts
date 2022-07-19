export * from './CodegenFile.js';
export { default as CodegenStep } from './CodegenStep.js';
import CodegenStep from './CodegenStep.js';
import { SchemaNode, SchemaEdge, SchemaFile } from '@aphro/schema-api';

export type Step = {
  new (opts: {
    nodeOrEdge: SchemaNode | SchemaEdge;
    edges: { [key: string]: SchemaEdge };
    dest: string;
  }): CodegenStep;
  accepts: (x: SchemaNode | SchemaEdge) => boolean;
};

export type GlobalStep = {
  new (nodes: SchemaNode[], edges: SchemaEdge[], dest: string): CodegenStep;
  accepts: (nodes: SchemaNode[], edges: SchemaEdge[]) => boolean;
};

export const generatedDir = 'generated';
