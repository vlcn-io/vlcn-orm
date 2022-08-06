// declare module "*.sql?raw";
import { CodegenStep, CodegenFile, generatedDir } from '@aphro/codegen-api';
import { SchemaEdge, SchemaNode } from '@aphro/schema-api';
import * as path from 'path';
import TypescriptFile from './TypescriptFile.js';

export class GenTypes_d_ts extends CodegenStep {
  constructor(
    private nodes: SchemaNode[],
    private edges: SchemaEdge[],
    private schemaFileName: string,
  ) {
    super();
  }

  static accepts(nodes: SchemaNode[], edges: SchemaEdge[]): boolean {
    return true;
  }

  async gen(): Promise<CodegenFile> {
    const filename = 'types.d.ts';
    return new TypescriptFile(path.join(generatedDir, filename), `declare module "*.sql?raw";`);
  }
}
