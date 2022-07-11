import { createCompiler } from '@aphro/schema';
import graphqlExtension from '@aphro/graphql-grammar';
import { GenGraphQLTypescriptResolvers } from '../GenGraphQLTypescriptResolvers.js';
import { SchemaEdge, SchemaNode } from '@aphro/schema-api';

const grammarExtensions = [graphqlExtension];
const { compileFromString } = createCompiler({ grammarExtensions });

const domain = `
Foo as Node {
  id: ID<Foo>
  name: string
} & GraphQL {
  read {
    id
    name
  }
  root
}
`;

test('Basic schema test', async () => {
  const compiled = compileIt(domain);
  const nodes = Object.values(compiled.nodes);
  const edges = Object.values(compiled.edges);

  const resolvers = await genIt(nodes, edges);
  expect(resolvers.contents).toEqual(`// SIGNED-SOURCE: <36385f753d282c42e89d5592b09a30aa>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import Foo from "./Foo.js";
import { Context } from "@aphro/runtime-ts";
import { P } from "@aphro/runtime-ts";

export const resolvers = {
  Query: {
    async foo(parent, args, ctx: { aphrodite: Context }, info): Promise<Foo> {
      return await Foo.genOnly(ctx.aphrodite, args.id);
    },

    async foos(
      parent,
      args,
      ctx: { aphrodite: Context },
      info
    ): Promise<Foo[]> {
      return await Foo.queryAll(ctx.aphrodite)
        .whereId(P.in(new Set(args.ids)))
        .gen();
    },
  },
};
`);
});

async function genIt(nodes: SchemaNode[], edges: SchemaEdge[]) {
  return await new GenGraphQLTypescriptResolvers(nodes, edges, 'domain.aphro').gen();
}

function compileIt(schema: string) {
  return compileFromString(schema)[1];
}
