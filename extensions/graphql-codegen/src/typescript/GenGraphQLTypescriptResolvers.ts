import { CodegenStep, CodegenFile } from '@aphro/codegen-api';
import { Node, Edge, Enum } from '@aphro/schema-api';
import shouldExpose from '../graphql/shouldExpose';

export class GenGraphQLTypescriptResolvers extends CodegenStep {
  constructor(private nodes: Node[], private edges: Edge[], private schemaFileName: string) {
    super();
  }

  static accepts(nodes: Node[], edges: Edge[]): boolean {
    return nodes.filter(shouldExpose).length > 0;
  }

  async gen(): Promise<CodegenFile> {
    const filename =
      this.schemaFileName.substring(0, this.schemaFileName.lastIndexOf('.')) +
      '.graphql-resolvers.ts';

    const code = `
`;
    throw new Error('unimplemented');
  }
}
