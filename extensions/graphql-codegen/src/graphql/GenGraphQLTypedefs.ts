import { CodegenStep, CodegenFile } from '@aphro/codegen-api';
import { Node, Edge, Enum } from '@aphro/schema-api';
import { nodeFn } from '@aphro/schema';
import { gatherReadFields } from './gatherReadFields.js';
import { inlineEnumName } from './inlineEnumName.js';
import { fieldTypeToGraphQLType } from './fieldTypeToGraphQLType.js';
import shouldExpose, { exposesRoot } from './shouldExpose.js';
import GraphQLFile from './GraphqlFile.js';
import { lowercaseAt } from '@strut/utils';

export class GenGraphQLTypedefs extends CodegenStep {
  constructor(private nodes: Node[], private edges: Edge[], private schemaFileName: string) {
    super();
  }

  static accepts(nodes: Node[], edges: Edge[]): boolean {
    return nodes.filter(shouldExpose).length > 0;
  }

  async gen(): Promise<CodegenFile> {
    const filename =
      this.schemaFileName.substring(0, this.schemaFileName.lastIndexOf('.')) + '.graphql';

    const code = `${this.getEnumDefsCode()}

${this.getObjectDefsCode()}

${this.getRootQueryDefsCode()}
`;

    // TODO: Should we generate a single `node` call to fetch any `node`?
    // How might we allow users to add their own root query types given Aphrodite doesn't express query types?
    // We can enable the hack of `sentinel nodes` for the time being
    // Given we want to be local, should we even support GraphQL?
    // The user can always just concat more things onto the end of the schema
    // And merge more resolvers in
    return new GraphQLFile(filename, code);
  }

  private getRootQueryDefsCode(): string {
    const nodes = this.nodes.filter(exposesRoot);

    if (nodes.length === 0) {
      return '';
    }

    return `type Query {
  ${nodes.map(n => this.getRootQueryDefCode(n)).join('\n  ')}
}`;
  }

  private getRootQueryDefCode(n: Node): string {
    return `${lowercaseAt(n.name, 0)}(id: ID!): ${n.name}
  ${lowercaseAt(n.name, 0)}s(ids: [ID!]!): [${n.name}]!`;
  }

  private getEnumDefsCode(): string {
    const inlineEnums = this.pullInlineEnums();
    // provide advice if we see inline enums?
    return inlineEnums
      .map(([name, e]) => {
        `enum ${name} {
  ${e.keys.join('\n  ')}
}`;
      })
      .join('\n');
  }

  private getObjectDefsCode(): string {
    return (
      this.nodes
        // Only define types for nodes that expose something
        .filter(shouldExpose)
        .map(this.getObjectDefCode)
        .join('\n\n')
    );
  }

  private getObjectDefCode = (n: Node): string => {
    return `type ${n.name} {
  ${this.getFieldDefsCode(n)}
}`;
    // ${this.getConnectionDefsCode(n)}
  };

  private getFieldDefsCode(n: Node): string {
    const fields = gatherReadFields(n);
    return fields.map(f => `${f.name}: ${fieldTypeToGraphQLType(n, f)}`).join('\n  ');
  }

  // Connection types are for edges. Given all edges extend a common base
  // that enables cursoring and pagination we can generate schema types that adhere to the
  // Relay connection spec https://relay.dev/graphql/connections.htm
  private getConnectionDefsCode(n: Node): string {
    return '';
  }

  private pullInlineEnums(): [string, Enum][] {
    return this.nodes
      .flatMap(n => {
        const inlineEnums = nodeFn.inlineEnums(n);
        if (inlineEnums.length === 0) {
          return null;
        }
        return inlineEnums.map((e): [string, Enum] => [inlineEnumName(n, e), e]);
      })
      .filter((n): n is [string, Enum] => n !== null);
  }
}
