import { CodegenStep, CodegenFile } from '@aphro/codegen-api';
import { SchemaNode, SchemaEdge, Enum } from '@aphro/schema-api';
import { nodeFn } from '@aphro/schema';
import { gatherReadEdges, gatherReadFields } from './gatherReadFields.js';
import { inlineEnumName } from './inlineEnumName.js';
import { fieldTypeToGraphQLType } from './fieldTypeToGraphQLType.js';
import shouldExpose, { exposesRoot } from './shouldExpose.js';
import GraphQLFile from './GraphqlFile.js';
import { lowercaseAt } from '@strut/utils';
import { connectionName, edgeName } from './connectionName.js';

export class GenGraphQLTypedefs extends CodegenStep {
  constructor(
    private nodes: SchemaNode[],
    private edges: SchemaEdge[],
    private schemaFileName: string,
  ) {
    super();
  }

  static accepts(nodes: SchemaNode[], edges: SchemaEdge[]): boolean {
    return nodes.filter(shouldExpose).length > 0;
  }

  async gen(): Promise<CodegenFile> {
    const filename =
      this.schemaFileName.substring(0, this.schemaFileName.lastIndexOf('.')) + '.graphql';

    const code = `type PageInfo {
  hasPreviousPage: Boolean!
  hasNextPage: Boolean!
  startCursor: String!
  endCursor: String!
}
${this.getEnumDefsCode()}

${this.getObjectDefsCode()}

${this.nodes.map(n => this.getConnectionDefsCode(n)).join('\n\n')}

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

  private getRootQueryDefCode(n: SchemaNode): string {
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

  private getObjectDefCode = (n: SchemaNode): string => {
    return `type ${n.name} {
  ${this.getFieldDefsCode(n)}
}`;
  };

  private getFieldDefsCode(n: SchemaNode): string {
    const fields = gatherReadFields(n);
    const edges = gatherReadEdges(n);
    // TODO: throw better errors if selected field does not exist
    // TODO: handle case where an operation with args is defined
    return fields
      .map(f => `${f.name}: ${fieldTypeToGraphQLType(n, f)}`)
      .concat(
        edges.map(
          e =>
            `${e.name}(first: Int, last: Int, before: String, after: String): ${connectionName(
              n,
              e,
            )}`,
        ),
      )
      .join('\n  ');
  }

  // Relay connection spec https://relay.dev/graphql/connections.htm
  private getConnectionDefsCode(n: SchemaNode): string {
    // Note: some edges should not return connections.
    // E.g., edges that only return 1 item.
    // These are:
    // 1. Field edges
    // 2. FK edges with a uniqueness constraint
    // 3. JX edges with uniqueness constraints
    const edges = gatherReadEdges(n);
    return edges
      .map(
        e => `type ${connectionName(n, e)} {
  edges: [${edgeName(n, e)}]
  pageInfo: PageInfo!
  count: Int
}

type ${edgeName(n, e)} {
  node: ${n.name}
  cursor: String
}`,
      )
      .join('\n\n');
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
