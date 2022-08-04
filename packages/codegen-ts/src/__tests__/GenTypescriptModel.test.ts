import GenTypescriptModel from '../GenTypescriptModel.js';
import { SchemaNode } from '@aphro/schema-api';
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
    `// SIGNED-SOURCE: <d2227f032dbc4a713934f4b7a353259d>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import IDOnly from "../IDOnly.js";
import { default as s } from "./IDOnlySpec.js";
import { P } from "@aphro/runtime-ts";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { modelGenMemo } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import IDOnlyQuery from "./IDOnlyQuery.js";
import { Context } from "@aphro/runtime-ts";

export type Data = {
  id: SID_of<IDOnly>;
};

// @Sealed(IDOnly)
export default abstract class IDOnlyBase extends Node<Data> {
  readonly spec = s as unknown as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as unknown as SID_of<this>;
  }

  static queryAll(ctx: Context): IDOnlyQuery {
    return IDOnlyQuery.create(ctx);
  }

  static genx = modelGenMemo(
    "test",
    "idonly",
    (ctx: Context, id: SID_of<IDOnly>): Promise<IDOnly> =>
      this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue()
  );

  static gen = modelGenMemo(
    "test",
    "idonly",
    (ctx: Context, id: SID_of<IDOnly>): Promise<IDOnly | null> =>
      this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue()
  );

  update(data: Partial<Data>) {
    return new UpdateMutationBuilder(this.ctx, this.spec, this)
      .set(data)
      .toChangeset();
  }

  static create(ctx: Context, data: Partial<Data>) {
    return new CreateMutationBuilder(ctx, s).set(data).toChangeset();
  }

  delete() {
    return new DeleteMutationBuilder(this.ctx, this.spec, this).toChangeset();
  }
}
`,
  );
});

test('Generating all primitive fields', async () => {
  const contents = (await genIt(compileFromString(PrimitiveFieldsSchema)[1].nodes.PrimitiveFields))
    .contents;
  expect(contents).toEqual(`// SIGNED-SOURCE: <e4485c83d52fc02c8c93ff3c75039b1a>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import PrimitiveFields from "../PrimitiveFields.js";
import { default as s } from "./PrimitiveFieldsSpec.js";
import { P } from "@aphro/runtime-ts";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { modelGenMemo } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
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

// @Sealed(PrimitiveFields)
export default abstract class PrimitiveFieldsBase extends Node<Data> {
  readonly spec = s as unknown as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as unknown as SID_of<this>;
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

  static genx = modelGenMemo(
    "test",
    "primitivefields",
    (ctx: Context, id: SID_of<PrimitiveFields>): Promise<PrimitiveFields> =>
      this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue()
  );

  static gen = modelGenMemo(
    "test",
    "primitivefields",
    (
      ctx: Context,
      id: SID_of<PrimitiveFields>
    ): Promise<PrimitiveFields | null> =>
      this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue()
  );

  update(data: Partial<Data>) {
    return new UpdateMutationBuilder(this.ctx, this.spec, this)
      .set(data)
      .toChangeset();
  }

  static create(ctx: Context, data: Partial<Data>) {
    return new CreateMutationBuilder(ctx, s).set(data).toChangeset();
  }

  delete() {
    return new DeleteMutationBuilder(this.ctx, this.spec, this).toChangeset();
  }
}
`);
});

test('Outbound field edge', async () => {
  const contents = (await genIt(compileFromString(OutboundFieldEdgeSchema)[1].nodes.Foo)).contents;
  expect(contents).toEqual(`// SIGNED-SOURCE: <63109a3e39d55fc60c7776573e39989c>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import Foo from "../Foo.js";
import { default as s } from "./FooSpec.js";
import { P } from "@aphro/runtime-ts";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { modelGenMemo } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import FooQuery from "./FooQuery.js";
import { Context } from "@aphro/runtime-ts";
import FooSpec from "./FooSpec.js";

export type Data = {
  fooId: SID_of<Foo>;
};

// @Sealed(Foo)
export default abstract class FooBase extends Node<Data> {
  readonly spec = s as unknown as NodeSpecWithCreate<this, Data>;

  get fooId(): SID_of<Foo> {
    return this.data.fooId;
  }

  queryFoos(): FooQuery {
    return FooQuery.fromId(this.ctx, this.fooId);
  }

  async genFoos(): Promise<Foo> {
    const existing = this.ctx.cache.get(
      this.fooId,
      FooSpec.storage.db,
      FooSpec.storage.tablish
    );
    if (existing != null) {
      return existing;
    }
    return await this.queryFoos().genxOnlyValue();
  }

  static queryAll(ctx: Context): FooQuery {
    return FooQuery.create(ctx);
  }

  static genx = modelGenMemo(
    "test",
    "foo",
    (ctx: Context, id: SID_of<Foo>): Promise<Foo> =>
      this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue()
  );

  static gen = modelGenMemo(
    "test",
    "foo",
    (ctx: Context, id: SID_of<Foo>): Promise<Foo | null> =>
      this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue()
  );

  update(data: Partial<Data>) {
    return new UpdateMutationBuilder(this.ctx, this.spec, this)
      .set(data)
      .toChangeset();
  }

  static create(ctx: Context, data: Partial<Data>) {
    return new CreateMutationBuilder(ctx, s).set(data).toChangeset();
  }

  delete() {
    return new DeleteMutationBuilder(this.ctx, this.spec, this).toChangeset();
  }
}
`);
});

test('Outbound foreign key edge', async () => {
  const contents = (await genIt(compileFromString(OutboundForeignKeyEdgeSchema)[1].nodes.Bar))
    .contents;
  expect(contents).toEqual(`// SIGNED-SOURCE: <8e8ecd287b4ade8e799a595bd0d4c1f6>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import Bar from "../Bar.js";
import { default as s } from "./BarSpec.js";
import { P } from "@aphro/runtime-ts";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { modelGenMemo } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import BarQuery from "./BarQuery.js";
import { Context } from "@aphro/runtime-ts";
import FooQuery from "./FooQuery.js";
import Foo from "../Foo.js";

export type Data = {};

// @Sealed(Bar)
export default abstract class BarBase extends Node<Data> {
  readonly spec = s as unknown as NodeSpecWithCreate<this, Data>;

  queryFoos(): FooQuery {
    return FooQuery.create(this.ctx).whereBarId(P.equals(this.id as any));
  }

  static queryAll(ctx: Context): BarQuery {
    return BarQuery.create(ctx);
  }

  static genx = modelGenMemo(
    "test",
    "bar",
    (ctx: Context, id: SID_of<Bar>): Promise<Bar> =>
      this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue()
  );

  static gen = modelGenMemo(
    "test",
    "bar",
    (ctx: Context, id: SID_of<Bar>): Promise<Bar | null> =>
      this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue()
  );

  update(data: Partial<Data>) {
    return new UpdateMutationBuilder(this.ctx, this.spec, this)
      .set(data)
      .toChangeset();
  }

  static create(ctx: Context, data: Partial<Data>) {
    return new CreateMutationBuilder(ctx, s).set(data).toChangeset();
  }

  delete() {
    return new DeleteMutationBuilder(this.ctx, this.spec, this).toChangeset();
  }
}
`);
});

async function genIt(schema: SchemaNode) {
  return await new GenTypescriptModel({ nodeOrEdge: schema, edges: {}, dest: '' }).gen();
}
