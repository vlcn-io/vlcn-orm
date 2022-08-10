import { SchemaNode, SchemaFile, ValidationError } from '@aphro/schema-api';
import { GrammarExtension } from '@aphro/grammar-extension-api';

export const name = 'graphql';

declare module '@aphro/schema-api' {
  interface NodeExtensions {
    graphql?: GraphQL;
  }

  interface NodeAstExtensions {
    graphql?: GraphQL;
  }
}

declare module '@aphro/grammar-extension-api' {
  interface ExtensionPoints {
    GraphQLExtension: string;
  }
}

export type GraphQL = {
  name: 'graphql';
  read: string[];
  write: string[];
  root?: 'root';
};

const extension: GrammarExtension<GraphQL, GraphQL> = {
  name: 'graphql',
  extends: {
    NodeFunction: 'GraphQL',
  },

  grammar(): string {
    return String.raw`
GraphQL
    = "GraphQL" "{" GraphQLExposeTypeDeclarations+ "}"

GraphQLExposeTypeDeclarations
    = "read" "{" GraphQLDeclarations "}" -- read
    | "write" "{" GraphQLDeclarations "}" -- write
    | "root" -- root

GraphQLDeclarations
    = GraphQLDeclarations name -- list
    | "" -- empty
`;
  },

  actions() {
    return {
      GraphQL(_, __, exposeTypes, ___) {
        exposeTypes = exposeTypes.toAst();
        const read = exposeTypes.find((t: any) => t.type === 'read');
        const write = exposeTypes.find((t: any) => t.type === 'write');
        const root = exposeTypes.find((t: any) => t.type === 'root');
        return {
          name,
          read: read?.declarations || [],
          write: write?.declarations || [],
          root: root?.type,
        };
      },
      GraphQLExposeTypeDeclarations_read(_, __, declarations, ___) {
        return {
          type: 'read',
          declarations: declarations.toAst(),
        };
      },
      GraphQLExposeTypeDeclarations_write(_, __, declarations, ___) {
        return {
          type: 'write',
          declarations: declarations.toAst(),
        };
      },
      GraphQLExposeTypeDeclarations_root(root) {
        return {
          type: 'root',
        };
      },
      GraphQLDeclarations_list: list,
      GraphQLDeclarations_empty: listInit,
    };
  },

  condensor(ast: GraphQL): [ValidationError[], GraphQL] {
    return [[], ast];
  },

  // augment(node: Node): void {},
};

export default extension;

const list = (l: any, r: any) => l.toAst().concat(r.toAst());
const listInit = (_: any) => [];

/**
 * expose decorators?
 * GraphQL may differ per target lang...
 * Or gen the code yourself...
 * Give ppl a decorator API for convenience?
 *  But decorators need to be cross-platform...
 */
