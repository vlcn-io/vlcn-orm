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
  name: string | null
  truthy: bool | null
  i32: int32 | null
  i64: int64 | null
  f32: float32 | null
  f64: float64 | null
  ui32: uint32 | null
  ui64: uint64 | null
  str: string | null
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
  expect(gql.contents.trim()).toEqual('# SIGNED-SOURCE: <2228e977ebea8966e27929f43e39cb67>');
});

test('Basic schema test', async () => {
  const compiled = compileIt(domain);
  const nodes = Object.values(compiled.nodes);
  const edges = Object.values(compiled.edges);
  expect(GenGraphQLTypedefs.accepts(nodes, edges)).toBe(true);

  const gql = await genIt(nodes, edges);
  expect(gql.contents).toEqual(`# SIGNED-SOURCE: <ac98ebac1f4a92aa37381fd2bb2ffbd2>


type Foo {
  id: ID!
  name: String!
  truthy: Boolean!
  i32: Int!
  i64: String!
  f32: Float!
  f64: Float!
  ui32: Int!
  ui64: String!
  str: String!
}

type Bar {
  id: ID!
  name: String
  truthy: Boolean
  i32: Int
  i64: String
  f32: Float
  f64: Float
  ui32: Int
  ui64: String
  str: String
}
`);
});

async function genIt(nodes: Node[], edges: Edge[]) {
  return await new GenGraphQLTypedefs(nodes, edges, 'domain.aphro').gen();
}

function compileIt(schema: string) {
  return compileFromString(schema)[1];
}
