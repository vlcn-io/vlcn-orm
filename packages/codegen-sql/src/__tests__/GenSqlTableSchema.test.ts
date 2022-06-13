import { createCompiler } from '@aphro/schema';
import { Node } from '@aphro/schema-api';
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
  expect(file.contents).toEqual(`-- SIGNED-SOURCE: <5febb299b33040785f5d813dadafad8e>
CREATE TABLE
  "foo" (
    "id" bigint,
    "i32" int,
    "ui32" int,
    "i64" bigint,
    "ui64" unsinged big int,
    "f32" float,
    "f64" double,
    "string" text,
    "bool" boolean,
    "enum" varchar(255),
    "timestamp" bigint,
    "lang" text,
    primary key ("id")
  )`);
});

async function genIt(schema: Node) {
  return await new GenSqlTableSchema(schema, '').gen();
}

function compileIt(schema: string) {
  return compileFromString(schema)[1].nodes.Foo;
}
