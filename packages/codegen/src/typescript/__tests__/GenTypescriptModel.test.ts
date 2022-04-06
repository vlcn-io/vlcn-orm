import GenTypescriptModel from "../GenTypescriptModel.js";
import { Node } from "../../../schema/parser/SchemaType.js";
import { compileFromString } from "../../../schema/v2/compile.js";

const IDOnlySchema = `
engine: postgres
db: test

IDOnly as Node {
  id: ID<IDOnly>
}
`;

const PrimitiveFieldsSchema = `
engine: postgres
db: test

PrimitiveFields as Node {
  id: ID<PrimitiveFields>
  mrBool: bool
  mrInt32: int32
  mrInt64: int64
  mrUint: uint64
  mrFloat: float32
  mrString: string
}
`;

const OutboundFieldEdgeSchema = `
engine: postgres
db: test

Foo as Node {
  fooId: ID<Foo>
} & OutboundEdges {
  foos: Edge<Foo.fooId>
}
`;

const OutboundForeignKeyEdgeSchema = `
engine: postgres
db: test

Bar as Node {
} & OutboundEdges {
  foos: Edge<Foo.barId>
}
`;

test("Generating an ID only model", () => {
  const contents = genIt(
    compileFromString(IDOnlySchema)[1].nodes.IDOnly
  ).contents;
  expect(contents).toEqual(
    `// SIGNED-SOURCE: <af8ef89465f19699d3ac1e3cf8a14efb>
import Model, { Spec } from "@strut/model/Model.js";
import { SID_of } from "@strut/sid";

export type Data = {
  id: SID_of<any>;
};

export default class IDOnly extends Model<Data> {
  get id(): SID_of<any> {
    return this.data.id;
  }
}

export const spec: Spec<Data> = {
  createFrom(data: Data) {
    return new IDOnly(data);
  },

  storageDescriptor: {
    engine: "postgres",
    db: "test",
    type: "sql",
    tablish: "idonly",
  },
};
`
  );
});

test("Generating all primitive fields", () => {
  const contents = genIt(
    compileFromString(PrimitiveFieldsSchema)[1].nodes.PrimitiveFields
  ).contents;
  expect(contents).toEqual(`// SIGNED-SOURCE: <938a3bbdaa7018a4f08e45ebf39dbe59>
import Model, { Spec } from "@strut/model/Model.js";
import { SID_of } from "@strut/sid";

export type Data = {
  id: SID_of<any>;
  mrBool: boolean;
  mrInt32: number;
  mrInt64: string;
  mrUint: string;
  mrFloat: number;
  mrString: string;
};

export default class PrimitiveFields extends Model<Data> {
  get id(): SID_of<any> {
    return this.data.id;
  }

  get mrBool(): boolean {
    return this.data.mrBool;
  }

  get mrInt32(): number {
    return this.data.mrInt32;
  }

  get mrInt64(): string {
    return this.data.mrInt64;
  }

  get mrUint(): string {
    return this.data.mrUint;
  }

  get mrFloat(): number {
    return this.data.mrFloat;
  }

  get mrString(): string {
    return this.data.mrString;
  }
}

export const spec: Spec<Data> = {
  createFrom(data: Data) {
    return new PrimitiveFields(data);
  },

  storageDescriptor: {
    engine: "postgres",
    db: "test",
    type: "sql",
    tablish: "primitivefields",
  },
};
`);
});

test("Outbound field edge", () => {
  const contents = genIt(
    compileFromString(OutboundFieldEdgeSchema)[1].nodes.Foo
  ).contents;

  expect(contents).toEqual(`// SIGNED-SOURCE: <086958ea3a098479094bc9e4d2242319>
import Model, { Spec } from "@strut/model/Model.js";
import { SID_of } from "@strut/sid";
import FooQuery from "./FooQuery.js";

export type Data = {
  fooId: SID_of<any>;
};

export default class Foo extends Model<Data> {
  get fooId(): SID_of<any> {
    return this.data.fooId;
  }

  queryFoos(): FooQuery {
    return FooQuery.fromId(this.fooId);
  }
}

export const spec: Spec<Data> = {
  createFrom(data: Data) {
    return new Foo(data);
  },

  storageDescriptor: {
    engine: "postgres",
    db: "test",
    type: "sql",
    tablish: "foo",
  },
};
`);
});

test("Outbound foreign key edge", () => {
  const contents = genIt(
    compileFromString(OutboundForeignKeyEdgeSchema)[1].nodes.Bar
  ).contents;

  expect(contents).toEqual(`// SIGNED-SOURCE: <428597b80667f77591dc68d944abb364>
import Model, { Spec } from "@strut/model/Model.js";
import { SID_of } from "@strut/sid";
import FooQuery from "./FooQuery.js";
import Foo from "./Foo.js";

export type Data = {};

export default class Bar extends Model<Data> {
  queryFoos(): FooQuery {
    return FooQuery.fromBarId(this.id);
  }
}

export const spec: Spec<Data> = {
  createFrom(data: Data) {
    return new Bar(data);
  },

  storageDescriptor: {
    engine: "postgres",
    db: "test",
    type: "sql",
    tablish: "bar",
  },
};
`);
});

function genIt(schema: Node) {
  return new GenTypescriptModel(schema).gen();
}
