import { createCompiler } from '@aphro/schema';
import graphqlExtension from '@aphro/graphql-grammar';
import { GenGraphQLTypescriptResolvers } from '../GenGraphQLTypescriptResolvers.js';
import { Edge, Node } from '@aphro/schema-api';

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
  expect(resolvers.contents).toEqual(`// SIGNED-SOURCE: <df2c2729676fa46901bb04791bd3c73b>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated \`BEGIN-MANUAL-SECTION\` and
 * \`END-MANUAL-SECTION\` markers.
 */
import Foo from "./Foo.js";
import { Context } from "@aphro/runtime-ts";

export const resolvers = {
  Query: {
    async foo(parent, args, ctx: { aphrodite: Context }, info): Foo {
      return await Foo.genOnly(ctx.aphrodite, args.id);
    },

    async foos(parent, args, ctx: { aphrodite: Context }, info): Foo[] {
      return await Foo.queryAll(ctx.aphrodite)
        .whereId(P.in(new Set(ctx.ids)))
        .gen();
    },
  },
};
`);
});

async function genIt(nodes: Node[], edges: Edge[]) {
  return await new GenGraphQLTypescriptResolvers(nodes, edges, 'domain.aphro').gen();
}

function compileIt(schema: string) {
  return compileFromString(schema)[1];
}
