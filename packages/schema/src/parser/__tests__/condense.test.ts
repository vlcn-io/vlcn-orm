import { ast, schemaFile } from "./testSchemaFile.js";
import condense from "../condense.js";
import { parseString } from "../parse";

test("Condensing the AST to proper schema types", () => {
  const [_errors, condensed] = condense(ast);
  expect(condensed).toEqual(schemaFile);
});

test("Duplicate nodes", () => {
  const ast = parseString(`
engine: postgres
db: test
Foo as Node {}
Foo as Node {}
`);
  const [errors, condensed] = condense(ast);
  expect(errors.length).toBe(1);
  expect(errors[0].type).toEqual("duplicate-nodes");
  // we still return data, even when we have errors.
  expect(condensed.nodes["Foo"]).not.toBeUndefined();
});

test("Duplicate top level edges", () => {
  const ast = parseString(`
engine: postgres
db: test
Friends as Edge<Person, Person> {}
Friends as Edge<Person, Person> {}
`);
  const [errors, condensed] = condense(ast);
  expect(errors.length).toBe(1);
  expect(errors[0].type).toEqual("duplicate-edges");
  // we still return data, even when we have errors.
  expect(condensed.edges["Friends"]).not.toBeUndefined();
});

test("Duplicate fields on node", () => {
  const ast = parseString(`
engine: postgres
db: test
Foo as Node {
  bar: int32
  bar: int32
}
`);
  const [errors, condensed] = condense(ast);
  expect(errors.length).toBe(1);
  expect(errors[0].type).toEqual("duplicate-fields");
  // we still return data, even when we have errors.
  expect(condensed.nodes["Foo"].fields["bar"]).not.toBeUndefined();
});

test("Duplicate outbound edges on node", () => {
  const ast = parseString(`
engine: postgres
db: test
Foo as Node {
  barId: ID<Bar>
} & OutboundEdges {
  bar: Edge<Foo.barId>
  bar: Edge<Foo.barId>
}
`);
  const [errors, condensed] = condense(ast);
  expect(errors.length).toBe(1);
  expect(errors[0].type).toEqual("duplicate-ob-edges");
  expect(
    (condensed.nodes["Foo"].extensions.outboundEdges?.edges || {})["bar"]
  ).not.toBeUndefined();
});

test("Duplicate inbound edges on node", () => {
  const ast = parseString(`
engine: postgres
db: test
Foo as Node {
  barId: ID<Bar>
} & InboundEdges {
  fromBar: Edge<Foo.barId>
  fromBar: Edge<Foo.barId>
}
`);
  const [errors, condensed] = condense(ast);
  expect(errors.length).toBe(1);
  expect(errors[0].type).toEqual("duplicate-ib-edges");
  expect(
    (condensed.nodes["Foo"].extensions.inboundEdges?.edges || {})["fromBar"]
  ).not.toBeUndefined();
});

test("Duplicate extensions on node", () => {
  const ast = parseString(`
engine: postgres
db: test
Foo as Node {
  barId: ID<Bar>
} & InboundEdges {
} & InboundEdges {}
`);
  const [errors, condensed] = condense(ast);
  expect(errors.length).toBe(1);
  expect(errors[0].type).toEqual("duplicate-extensions");
  expect(condensed.nodes["Foo"].extensions.inboundEdges).not.toBeUndefined();
});

test("Duplicate extensions on edge", () => {
  const ast = parseString(`
engine: postgres
db: test
FooToFooEdge as Edge<Foo, Foo> {
  barId: ID<Bar>
} & Index {
} & Index {}
`);
  const [errors, condensed] = condense(ast);
  expect(errors.length).toBe(1);
  expect(errors[0].type).toEqual("duplicate-extensions");
  expect(condensed.edges["FooToFooEdge"].extensions.index).not.toBeUndefined();
});

test("Duplicate fields on edge", () => {
  const ast = parseString(`
engine: postgres
db: test
Bar as Edge<Foo, Foo> {
  bar: int32
  bar: int32
}
`);
  const [errors, condensed] = condense(ast);
  expect(errors.length).toBe(1);
  expect(errors[0].type).toEqual("duplicate-fields");
  // we still return data, even when we have errors.
  expect(condensed.edges["Bar"].fields["bar"]).not.toBeUndefined();
});
