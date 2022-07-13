import { CodegenFile, CodegenStep } from '@aphro/codegen-api';
import { SchemaEdge, SchemaNode } from '@aphro/schema-api';
import TypescriptFile from './TypescriptFile.js';
import * as fs from 'fs';
import * as path from 'path';

export default class GenTypescriptModelManualMethodsClass extends CodegenStep {
  static accepts(schema: SchemaNode | SchemaEdge): boolean {
    return true;
  }

  private readonly schema: SchemaNode | SchemaEdge;
  private edges: { [key: string]: SchemaEdge };
  private dest: string;

  constructor(opts: {
    nodeOrEdge: SchemaNode | SchemaEdge;
    edges: { [key: string]: SchemaEdge };
    dest: string;
  }) {
    super();
    this.schema = opts.nodeOrEdge;
    this.edges = opts.edges;
    this.dest = opts.dest;
  }

  async gen(): Promise<CodegenFile> {
    const filename = this.schema.name + 'ManualMethods.ts';
    let exists = false;
    try {
      await fs.promises.access(path.join(this.dest, filename));
      exists = true;
    } catch (e) {}
    if (exists) {
      return new TypescriptFile('', '', true, true);
    }

    return new TypescriptFile(
      filename,
      `import ${this.schema.name} from './${this.schema.name}.js'

export interface ManualMethods {
  // example(): void;
}

export const manualMethods: ManualMethods = {
  // example(this: ${this.schema.name}): void {
    // Note: "this" (above) is a "fake" parameter used to set the type of "this"
    // https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function
  // }
};
      `,
      true,
    );
  }
}
