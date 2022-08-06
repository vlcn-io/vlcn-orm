import { createCompiler } from '@aphro/schema';
import { SchemaNode } from '@aphro/schema-api';
import GenSqlTableSchema from '../GenSqlTableSchema';

const { compileFromString } = createCompiler();

const basicSchema = `
engine: sqlite
db: test

Foo as Node {
  id: ID<Foo>
  i32: int32
  ui32: uint32
  i64: int64
  ui64: uint64
  f32: float32
  f64: float64
  string: string
  bool: bool
  enum: Enumeration<foo | bar>
  timestamp: Timestamp
  lang: NaturalLanguage
}`;

test('sqlite & basic schema', async () => {
  const schema = compileIt(basicSchema);
  const file = await genIt(schema);
  expect(file.contents).toEqual(`-- SIGNED-SOURCE: <f0ac4ada01711765757b23e2f3815630>
CREATE TABLE
  "foo" (
    "id" bigint NOT NULL,
    "i32" int NOT NULL,
    "ui32" int NOT NULL,
    "i64" bigint NOT NULL,
    "ui64" unsinged big int NOT NULL,
    "f32" float NOT NULL,
    "f64" double NOT NULL,
    "string" text NOT NULL,
    "bool" boolean NOT NULL,
    "enum" varchar(255) NOT NULL,
    "timestamp" bigint NOT NULL,
    "lang" text NOT NULL,
    primary key ("id")
  )`);
});

async function genIt(schema: SchemaNode) {
  return await new GenSqlTableSchema({ nodeOrEdge: schema, edges: {}, dest: '' }).gen();
}

function compileIt(schema: string) {
  return compileFromString(schema)[1].nodes.Foo;
}
