import { CodegenStep, CodegenFile, generatedDir } from '@aphro/codegen-api';
import { nodeFn } from '@aphro/schema';
import { SchemaEdge, SchemaNode } from '@aphro/schema-api';
import * as path from 'path';
import GenTypescriptQuery from './GenTypescriptQuery.js';
import GenTypescriptSpec from './GenTypescriptSpec.js';
import TypescriptFile from './TypescriptFile.js';

export class GenSchemaExports extends CodegenStep {
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
    const filename = 'exports.ts';
    const code = `${this.nodes.map(this.getExportCode).join('\n')}
    ${this.edges.map(this.getExportCode).join('\n')}`;
    return new TypescriptFile(path.join(generatedDir, filename), code);
  }

  private getExportCode(nodeOrEdge: SchemaEdge | SchemaNode): string {
    const exports = [`export { default as ${nodeOrEdge.name} } from "../${nodeOrEdge.name}.js";`];
    if ((nodeOrEdge.extensions as any).mutations) {
      exports.push(
        `export { default as ${nodeOrEdge.name}Mutations } from "./${nodeOrEdge.name}Mutations.js";`,
      );
    }

    if (GenTypescriptSpec.accepts(nodeOrEdge)) {
      exports.push(
        `export { default as ${nodeFn.specName(nodeOrEdge.name)} } from "./${nodeFn.specName(
          nodeOrEdge.name,
        )}.js"`,
      );
    }
    if (GenTypescriptQuery.accepts(nodeOrEdge)) {
      exports.push(
        `export { default as ${nodeFn.queryTypeName(
          nodeOrEdge.name,
        )} } from "./${nodeFn.queryTypeName(nodeOrEdge.name)}.js"`,
      );
    }

    return exports.join('\n');
  }
}
