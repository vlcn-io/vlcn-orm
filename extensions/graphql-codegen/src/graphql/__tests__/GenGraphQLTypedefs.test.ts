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
Foo as Node {
  id: ID<Foo>
  name: string
  truthy: bool
  i32: int32
  i64: int64
  f32: float32
  f64: float64
  ui32: uint32
  ui64: uint64
  str: string
} & GraphQL {
  read {
    id
    name
    truthy
    i32
    i64
    f32
    f64
    ui32
    ui64
    str
  }
}

Bar as Node {
  id: ID<Bar>
}

Baz as Node {
  id: ID<Baz>
}
`;

test('Nothing exposed to GraphQL', async () => {
  const compiled = compileIt(noGraphQLExposure);
  const nodes = Object.values(compiled.nodes);
  const edges = Object.values(compiled.edges);
  expect(GenGraphQLTypedefs.accepts(nodes, edges)).toBe(false);

  const gql = await genIt(nodes, edges);
  expect(gql.contents.trim()).toEqual('# SIGNED-SOURCE: <ff4c8ff01d544500ea4bfea43e6108c1>');
});

test('Basic schema test', async () => {
  const compiled = compileIt(domain);
  const nodes = Object.values(compiled.nodes);
  const edges = Object.values(compiled.edges);
  expect(GenGraphQLTypedefs.accepts(nodes, edges)).toBe(true);

  const gql = await genIt(nodes, edges);
  console.log(gql.contents);
});

async function genIt(nodes: Node[], edges: Edge[]) {
  return await new GenGraphQLTypedefs(nodes, edges, 'domain.aphro').gen();
}

function compileIt(schema: string) {
  return compileFromString(schema)[1];
}
