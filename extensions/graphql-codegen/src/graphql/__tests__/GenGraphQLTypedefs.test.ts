import { createCompiler } from '@aphro/schema';
import graphqlExtension from '@aphro/graphql-grammar';
import { GenGraphQLTypedefs } from '../GenGraphQLTypedefs';
import { Edge, Node } from '@aphro/schema-api';

const grammarExtensions = [graphqlExtension];
const { compileFromString } = createCompiler({ grammarExtensions });

const noGraphQLExposure = `
Foo as Node {}
`;

const domain = `
Foo as Node {}

Bar as Node {}

Baz as Node {}
`;

test('Nothing exposed to GraphQL', async () => {
  const compiled = compileIt(noGraphQLExposure);
  const nodes = Object.values(compiled.nodes);
  const edges = Object.values(compiled.edges);
  expect(GenGraphQLTypedefs.accepts(nodes, edges)).toBe(false);

  const gql = await genIt(nodes, edges);
  expect(gql.contents.trim()).toEqual('# SIGNED-SOURCE: <ff4c8ff01d544500ea4bfea43e6108c1>');
});

async function genIt(nodes: Node[], edges: Edge[]) {
  return await new GenGraphQLTypedefs(nodes, edges, 'domain.aphro').gen();
}

function compileIt(schema: string) {
  return compileFromString(schema)[1];
}
