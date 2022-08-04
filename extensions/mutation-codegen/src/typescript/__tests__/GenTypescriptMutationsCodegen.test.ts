import fc from 'fast-check';
import { createCompiler } from '@aphro/schema';
import { SchemaNode, primitives, PrimitiveSubtype } from '@aphro/schema-api';
import { GenTypescriptMutations } from '../GenTypescriptMutations';
import mutationExtension from '@aphro/mutation-grammar';
import { removeSignature } from '@aphro/codegen';
import { algolTemplates } from '@aphro/codegen-api';

const grammarExtensions = [mutationExtension];
const { compileFromString } = createCompiler({ grammarExtensions });

test('All primitive field references can be used as inputs', async () => {
  await Promise.all(
    primitives.map(async primitive => {
      const schema = `
      Foo as Node {
        someField: ${primitive}
      } & Mutations {
        create as Create {
          someField
        }
      }
    `;
      const contents = removeSignature(
        (await genIt(compileFromString(schema)[1].nodes.Foo)).contents,
        algolTemplates,
      );
      expect(contents).toEqual(`/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import * as impls from "../FooMutationsImpl.js";
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import Foo from "../Foo.js";
import { default as spec } from "./FooSpec.js";
import { Data } from "./FooBase.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";

export type CreateArgs = { someField: ${asTsType(primitive)} };
class Mutations extends MutationsBase<Foo, Data> {
  constructor(ctx: Context, mutator: ICreateOrUpdateBuilder<Foo, Data>) {
    super(ctx, mutator);
  }

  create(args: CreateArgs): this {
    const extraChangesets = impls.createImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }
}

export default class FooMutations {
  static create(ctx: Context, args: CreateArgs): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(ctx, spec)).create(
      args
    );
  }
}
`);
    }),
  );
});

test('All primitive types can be used as custom inputs', async () => {
  await Promise.all(
    primitives.map(async primitive => {
      const schema = `
      Foo as Node {
      } & Mutations {
        create as Create {
          customField: ${primitive}
        }
      }
    `;
      const contents = removeSignature(
        (await genIt(compileFromString(schema)[1].nodes.Foo)).contents,
        algolTemplates,
      );
      expect(contents).toEqual(`/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import * as impls from "../FooMutationsImpl.js";
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import Foo from "../Foo.js";
import { default as spec } from "./FooSpec.js";
import { Data } from "./FooBase.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";

export type CreateArgs = { customField: ${asTsType(primitive)} };
class Mutations extends MutationsBase<Foo, Data> {
  constructor(ctx: Context, mutator: ICreateOrUpdateBuilder<Foo, Data>) {
    super(ctx, mutator);
  }

  create(args: CreateArgs): this {
    const extraChangesets = impls.createImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }
}

export default class FooMutations {
  static create(ctx: Context, args: CreateArgs): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(ctx, spec)).create(
      args
    );
  }
}
`);
    }),
  );
});

// test('All composite types can be used as inputs', () => {});

test('Node type names can be used as inputs', async () => {
  return fc.assert(
    fc.asyncProperty(
      fc.stringOf(fc.constantFrom('a', 'b', 'c', 'd', 'e'), { maxLength: 5, minLength: 3 }),
      async customName => {
        const schema = `
        Foo as Node {
        } & Mutations {
          create as Create {
            customField: ${customName}
          }
        }
      `;
        const contents = removeSignature(
          (await genIt(compileFromString(schema)[1].nodes.Foo)).contents,
          algolTemplates,
        );

        expect(contents).toEqual(`/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import * as impls from "../FooMutationsImpl.js";
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import Foo from "../Foo.js";
import { default as spec } from "./FooSpec.js";
import { Data } from "./FooBase.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";
import ${customName} from "../${customName}.js";
import { Data as ${customName}Data } from "./${customName}Base.js";

export type CreateArgs = { customField: ${customName} | Changeset<${customName}, ${customName}Data> };
class Mutations extends MutationsBase<Foo, Data> {
  constructor(ctx: Context, mutator: ICreateOrUpdateBuilder<Foo, Data>) {
    super(ctx, mutator);
  }

  create(args: CreateArgs): this {
    const extraChangesets = impls.createImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }
}

export default class FooMutations {
  static create(ctx: Context, args: CreateArgs): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(ctx, spec)).create(
      args
    );
  }
}
`);
      },
    ),
  );
});

// test('ID imports', () => {});

async function genIt(schema: SchemaNode) {
  return await new GenTypescriptMutations({
    nodeOrEdge: schema,
    edges: {},
    dest: '',
  }).gen();
}

function asTsType(prim: PrimitiveSubtype): string {
  switch (prim) {
    case 'bool':
      return 'boolean';
    case 'float32':
    case 'int32':
    case 'uint32':
      return 'number';
    case 'null':
      return 'null';
    // JS numbers are 53 bits so anything greater is a string.
    case 'int64':
    case 'float64':
    case 'uint64':
    case 'string':
      return 'string';
    case 'any':
      return 'any';
  }
}
