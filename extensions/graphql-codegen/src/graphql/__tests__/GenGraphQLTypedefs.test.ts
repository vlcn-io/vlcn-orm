import { createCompiler } from '@aphro/schema';
import graphqlExtension from '@aphro/graphql-grammar';
import { GenGraphQLTypedefs } from '../GenGraphQLTypedefs.js';
import { SchemaEdge, SchemaNode } from '@aphro/schema-api';

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
  root
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
  expect(gql.contents.trim()).toEqual(`# SIGNED-SOURCE: <fb8490f51e794f0195347fd473a82c04>
type PageInfo {
  hasPreviousPage: Boolean!
  hasNextPage: Boolean!
  startCursor: String!
  endCursor: String!
}`);
});

test('Basic schema test', async () => {
  const compiled = compileIt(domain);
  const nodes = Object.values(compiled.nodes);
  const edges = Object.values(compiled.edges);
  expect(GenGraphQLTypedefs.accepts(nodes, edges)).toBe(true);

  const gql = await genIt(nodes, edges);
  expect(gql.contents).toEqual(`# SIGNED-SOURCE: <eef8e68746f5972691460eb745867fa6>
type PageInfo {
  hasPreviousPage: Boolean!
  hasNextPage: Boolean!
  startCursor: String!
  endCursor: String!
}


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







type Query {
  bar(id: ID!): Bar
  bars(ids: [ID!]!): [Bar]!
}
`);
});

async function genIt(nodes: SchemaNode[], edges: SchemaEdge[]) {
  return await new GenGraphQLTypedefs(nodes, edges, 'domain.aphro').gen();
}

function compileIt(schema: string) {
  return compileFromString(schema)[1];
}
