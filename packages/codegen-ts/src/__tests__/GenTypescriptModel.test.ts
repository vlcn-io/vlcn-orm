import GenTypescriptModel from '../GenTypescriptModel.js';
import { Node } from '@aphro/schema-api';
import { createCompiler } from '@aphro/schema';

const { compileFromString } = createCompiler();

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

test('Generating an ID only model', async () => {
  const contents = (await genIt(compileFromString(IDOnlySchema)[1].nodes.IDOnly)).contents;
  expect(contents).toEqual(
    `// SIGNED-SOURCE: <9861e185b20ac274b19c5501e4f1c8a8>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated \`BEGIN-MANUAL-SECTION\` and
 * \`END-MANUAL-SECTION\` markers.
 */
import { default as s } from "./IDOnlySpec.js";
import { P } from "@aphro/runtime-ts";
import { Model } from "@aphro/runtime-ts";
import { ModelSpec } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import IDOnlyQuery from "./IDOnlyQuery.js";
import { Context } from "@aphro/runtime-ts";

export type Data = {
  id: SID_of<IDOnly>;
};

export default class IDOnly extends Model<Data> {
  readonly spec = s as ModelSpec<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  static queryAll(ctx: Context): IDOnlyQuery {
    return IDOnlyQuery.create(ctx);
  }
}
`,
  );
});

test('Generating all primitive fields', async () => {
  const contents = (await genIt(compileFromString(PrimitiveFieldsSchema)[1].nodes.PrimitiveFields))
    .contents;
  expect(contents).toEqual(`// SIGNED-SOURCE: <e583b47a1583268c8aa0964a729316f9>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated \`BEGIN-MANUAL-SECTION\` and
 * \`END-MANUAL-SECTION\` markers.
 */
import { default as s } from "./PrimitiveFieldsSpec.js";
import { P } from "@aphro/runtime-ts";
import { Model } from "@aphro/runtime-ts";
import { ModelSpec } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import PrimitiveFieldsQuery from "./PrimitiveFieldsQuery.js";
import { Context } from "@aphro/runtime-ts";

export type Data = {
  id: SID_of<PrimitiveFields>;
  mrBool: boolean;
  mrInt32: number;
  mrInt64: string;
  mrUint: string;
  mrFloat: number;
  mrString: string;
};

export default class PrimitiveFields extends Model<Data> {
  readonly spec = s as ModelSpec<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
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

  static queryAll(ctx: Context): PrimitiveFieldsQuery {
    return PrimitiveFieldsQuery.create(ctx);
  }
}
`);
});

test('Outbound field edge', async () => {
  const contents = (await genIt(compileFromString(OutboundFieldEdgeSchema)[1].nodes.Foo)).contents;
  expect(contents).toEqual(`// SIGNED-SOURCE: <793e13323fd680b424978b6281588c57>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated \`BEGIN-MANUAL-SECTION\` and
 * \`END-MANUAL-SECTION\` markers.
 */
import { default as s } from "./FooSpec.js";
import { P } from "@aphro/runtime-ts";
import { Model } from "@aphro/runtime-ts";
import { ModelSpec } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import FooQuery from "./FooQuery.js";
import { Context } from "@aphro/runtime-ts";

export type Data = {
  fooId: SID_of<Foo>;
};

export default class Foo extends Model<Data> {
  readonly spec = s as ModelSpec<this, Data>;

  get fooId(): SID_of<Foo> {
    return this.data.fooId;
  }

  queryFoos(): FooQuery {
    return FooQuery.fromId(this.ctx, this.fooId);
  }

  static queryAll(ctx: Context): FooQuery {
    return FooQuery.create(ctx);
  }
}
`);
});

test('Outbound foreign key edge', async () => {
  const contents = (await genIt(compileFromString(OutboundForeignKeyEdgeSchema)[1].nodes.Bar))
    .contents;
  expect(contents).toEqual(`// SIGNED-SOURCE: <0486be955fd7838bad16f029bfc448b8>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated \`BEGIN-MANUAL-SECTION\` and
 * \`END-MANUAL-SECTION\` markers.
 */
import { default as s } from "./BarSpec.js";
import { P } from "@aphro/runtime-ts";
import { Model } from "@aphro/runtime-ts";
import { ModelSpec } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import BarQuery from "./BarQuery.js";
import { Context } from "@aphro/runtime-ts";
import FooQuery from "./FooQuery.js";
import Foo from "./Foo.js";

export type Data = {};

export default class Bar extends Model<Data> {
  readonly spec = s as ModelSpec<this, Data>;

  queryFoos(): FooQuery {
    return FooQuery.create(this.ctx).whereBarId(P.equals(this.id));
  }

  static queryAll(ctx: Context): BarQuery {
    return BarQuery.create(ctx);
  }
}
`);
});

async function genIt(schema: Node) {
  return await new GenTypescriptModel({ nodeOrEdge: schema, nodes: {}, edges: {}, dest: '' }).gen();
}
