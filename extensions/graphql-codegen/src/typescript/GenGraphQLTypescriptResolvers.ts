import { CodegenStep, CodegenFile } from '@aphro/codegen-api';
import { importsToString, TypescriptFile } from '@aphro/codegen-ts';
import { tsImport } from '@aphro/schema';
import { SchemaNode, SchemaEdge, Import } from '@aphro/schema-api';
import { lowercaseAt } from '@strut/utils';
import shouldExpose, { exposesRoot } from '../graphql/shouldExpose.js';

export class GenGraphQLTypescriptResolvers extends CodegenStep {
  private nodesWithRootCalls: SchemaNode[];

  constructor(
    private nodes: SchemaNode[],
    private edges: SchemaEdge[],
    private schemaFileName: string,
  ) {
    super();
    this.nodesWithRootCalls = this.nodes.filter(exposesRoot);
  }

  static accepts(nodes: SchemaNode[], edges: SchemaEdge[]): boolean {
    return nodes.filter(shouldExpose).length > 0;
  }

  async gen(): Promise<CodegenFile> {
    const filename =
      this.schemaFileName.substring(0, this.schemaFileName.lastIndexOf('.')) +
      '.graphql-resolvers.ts';

    // TODO: handle nodes with edges
    // and nodes with computed properties
    const code = `${importsToString(this.collectImports())}

export const resolvers = {
  Query: {
    ${this.nodesWithRootCalls.map(this.getRootQueryCode).join(',\n')}
  }
};
`;
    return new TypescriptFile(filename, code);
  }

  private collectImports(): Import[] {
    return [
      ...this.nodesWithRootCalls.map(n => tsImport(n.name, null, './' + n.name + '.js')),
      tsImport('{Context}', null, '@aphro/runtime-ts'),
      tsImport('{P}', null, '@aphro/runtime-ts'),
    ];
  }

  private getRootQueryCode = (n: SchemaNode): string => {
    // Will need to inject _our_ context
    // https://www.graphql-yoga.com/tutorial/basic/07-connecting-server-and-database
    return `async ${lowercaseAt(
      n.name,
      0,
    )}(parent, args, ctx: {aphrodite: Context}, info): Promise<${n.name}> {
      return await ${n.name}.genOnly(ctx.aphrodite, args.id);
    },
    
    async ${lowercaseAt(n.name, 0)}s(parent, args, ctx: {aphrodite: Context}, info): Promise<${
      n.name
    }[]> {
      return await ${n.name}.queryAll(ctx.aphrodite).whereId(P.in(new Set(args.ids))).gen();
    }`;
  };
}
