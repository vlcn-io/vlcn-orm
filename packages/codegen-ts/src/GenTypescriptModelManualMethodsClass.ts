import { CodegenFile, CodegenStep } from '@aphro/codegen-api';
import { SchemaEdge, SchemaNode } from '@aphro/schema-api';
import TypescriptFile from './TypescriptFile.js';

export default class GenTypescriptModelManualMethodsClass extends CodegenStep {
  static accepts(schema: SchemaNode | SchemaEdge): boolean {
    return schema.type === 'node';
  }

  private readonly schema: SchemaNode | SchemaEdge;
  private edges: { [key: string]: SchemaEdge };

  constructor(opts: {
    nodeOrEdge: SchemaNode | SchemaEdge;
    edges: { [key: string]: SchemaEdge };
    dest: string;
  }) {
    super();
    this.schema = opts.nodeOrEdge;
    this.edges = opts.edges;
  }

  async gen(): Promise<CodegenFile> {
    return new TypescriptFile(
      this.schema.name + 'ManualMethods.ts',
      `import ${this.schema.name} from './${this.schema.name}.js'

export interface ManualMethods {
  example()
}

export manualMethods: ManualMethods = {
  example(this: ${this.schema.name}) {
    // Note: "this" (above) is a "fake" parameter used to set the type of "this"
    // https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function
  }
};
      `,
      true,
    );
  }
}
