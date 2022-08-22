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
  expect(file.contents).toEqual(`-- SIGNED-SOURCE: <0e6c49915e3079d3e14291d4fdf5e542>
-- STATEMENT
CREATE TABLE
  "foo" (
    "id",
    "i32",
    "ui32",
    "i64",
    "ui64",
    "f32",
    "f64",
    "string",
    "bool",
    "enum",
    "timestamp",
    "lang",
    PRIMARY KEY ("id")
  );`);
});

async function genIt(schema: SchemaNode) {
  return await new GenSqlTableSchema({ nodeOrEdge: schema, edges: {}, dest: '' }).gen();
}

function compileIt(schema: string) {
  return compileFromString(schema)[1].nodes.Foo;
}
