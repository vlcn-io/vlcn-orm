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
    `// SIGNED-SOURCE: <d8dcff2b5ddb4dc9597ac68b76d43350>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { applyMixins } from "@aphro/runtime-ts";
import { default as s } from "./IDOnlySpec.js";
import { P } from "@aphro/runtime-ts";
import { ManualMethods, manualMethods } from "./IDOnlyManualMethods.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import IDOnlyQuery from "./IDOnlyQuery.js";
import { Context } from "@aphro/runtime-ts";

export type Data = {
  id: SID_of<IDOnly>;
};

class IDOnly extends Node<Data> {
  readonly spec = s as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  static queryAll(ctx: Context): IDOnlyQuery {
    return IDOnlyQuery.create(ctx);
  }

  static async genx(ctx: Context, id: SID_of<IDOnly>): Promise<IDOnly> {
    const existing = ctx.cache.get(id, IDOnly.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(ctx: Context, id: SID_of<IDOnly>): Promise<IDOnly | null> {
    const existing = ctx.cache.get(id, IDOnly.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue();
  }

  update(data: Partial<Data>) {
    return new UpdateMutationBuilder(this.ctx, this.spec, this)
      .set(data)
      .toChangeset();
  }

  static create(ctx: Context, data: Partial<Data>) {
    return new CreateMutationBuilder(ctx, s).set(data).toChangeset();
  }

  delete() {
    return new DeleteMutationBuilder(this.ctx, s, this).toChangeset();
  }
}

interface IDOnly extends ManualMethods {}
applyMixins(IDOnly, [manualMethods]);
export default IDOnly;
`,
  );
});

test('Generating all primitive fields', async () => {
  const contents = (await genIt(compileFromString(PrimitiveFieldsSchema)[1].nodes.PrimitiveFields))
    .contents;
  expect(contents).toEqual(`// SIGNED-SOURCE: <a04ddc9d00901b53a9f6202ee658ee6e>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { applyMixins } from "@aphro/runtime-ts";
import { default as s } from "./PrimitiveFieldsSpec.js";
import { P } from "@aphro/runtime-ts";
import {
  ManualMethods,
  manualMethods,
} from "./PrimitiveFieldsManualMethods.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
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

class PrimitiveFields extends Node<Data> {
  readonly spec = s as NodeSpecWithCreate<this, Data>;

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

  static async genx(
    ctx: Context,
    id: SID_of<PrimitiveFields>
  ): Promise<PrimitiveFields> {
    const existing = ctx.cache.get(id, PrimitiveFields.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(
    ctx: Context,
    id: SID_of<PrimitiveFields>
  ): Promise<PrimitiveFields | null> {
    const existing = ctx.cache.get(id, PrimitiveFields.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue();
  }

  update(data: Partial<Data>) {
    return new UpdateMutationBuilder(this.ctx, this.spec, this)
      .set(data)
      .toChangeset();
  }

  static create(ctx: Context, data: Partial<Data>) {
    return new CreateMutationBuilder(ctx, s).set(data).toChangeset();
  }

  delete() {
    return new DeleteMutationBuilder(this.ctx, s, this).toChangeset();
  }
}

interface PrimitiveFields extends ManualMethods {}
applyMixins(PrimitiveFields, [manualMethods]);
export default PrimitiveFields;
`);
});

test('Outbound field edge', async () => {
  const contents = (await genIt(compileFromString(OutboundFieldEdgeSchema)[1].nodes.Foo)).contents;
  expect(contents).toEqual(`// SIGNED-SOURCE: <dc03464592ff6f13ae5e595e71fc33f4>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { applyMixins } from "@aphro/runtime-ts";
import { default as s } from "./FooSpec.js";
import { P } from "@aphro/runtime-ts";
import { ManualMethods, manualMethods } from "./FooManualMethods.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import FooQuery from "./FooQuery.js";
import { Context } from "@aphro/runtime-ts";

export type Data = {
  fooId: SID_of<Foo>;
};

class Foo extends Node<Data> {
  readonly spec = s as NodeSpecWithCreate<this, Data>;

  get fooId(): SID_of<Foo> {
    return this.data.fooId;
  }

  queryFoos(): FooQuery {
    return FooQuery.fromId(this.ctx, this.fooId);
  }

  static queryAll(ctx: Context): FooQuery {
    return FooQuery.create(ctx);
  }

  static async genx(ctx: Context, id: SID_of<Foo>): Promise<Foo> {
    const existing = ctx.cache.get(id, Foo.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(ctx: Context, id: SID_of<Foo>): Promise<Foo | null> {
    const existing = ctx.cache.get(id, Foo.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue();
  }

  update(data: Partial<Data>) {
    return new UpdateMutationBuilder(this.ctx, this.spec, this)
      .set(data)
      .toChangeset();
  }

  static create(ctx: Context, data: Partial<Data>) {
    return new CreateMutationBuilder(ctx, s).set(data).toChangeset();
  }

  delete() {
    return new DeleteMutationBuilder(this.ctx, s, this).toChangeset();
  }
}

interface Foo extends ManualMethods {}
applyMixins(Foo, [manualMethods]);
export default Foo;
`);
});

test('Outbound foreign key edge', async () => {
  const contents = (await genIt(compileFromString(OutboundForeignKeyEdgeSchema)[1].nodes.Bar))
    .contents;
  expect(contents).toEqual(`// SIGNED-SOURCE: <10e5cd9dfe2a263471dc70926af2a05a>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { applyMixins } from "@aphro/runtime-ts";
import { default as s } from "./BarSpec.js";
import { P } from "@aphro/runtime-ts";
import { ManualMethods, manualMethods } from "./BarManualMethods.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import BarQuery from "./BarQuery.js";
import { Context } from "@aphro/runtime-ts";
import FooQuery from "./FooQuery.js";
import Foo from "./Foo.js";

export type Data = {};

class Bar extends Node<Data> {
  readonly spec = s as NodeSpecWithCreate<this, Data>;

  queryFoos(): FooQuery {
    return FooQuery.create(this.ctx).whereBarId(P.equals(this.id));
  }

  static queryAll(ctx: Context): BarQuery {
    return BarQuery.create(ctx);
  }

  static async genx(ctx: Context, id: SID_of<Bar>): Promise<Bar> {
    const existing = ctx.cache.get(id, Bar.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(ctx: Context, id: SID_of<Bar>): Promise<Bar | null> {
    const existing = ctx.cache.get(id, Bar.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue();
  }

  update(data: Partial<Data>) {
    return new UpdateMutationBuilder(this.ctx, this.spec, this)
      .set(data)
      .toChangeset();
  }

  static create(ctx: Context, data: Partial<Data>) {
    return new CreateMutationBuilder(ctx, s).set(data).toChangeset();
  }

  delete() {
    return new DeleteMutationBuilder(this.ctx, s, this).toChangeset();
  }
}

interface Bar extends ManualMethods {}
applyMixins(Bar, [manualMethods]);
export default Bar;
`);
});

async function genIt(schema: SchemaNode) {
  return await new GenTypescriptModel({ nodeOrEdge: schema, edges: {}, dest: '' }).gen();
}
