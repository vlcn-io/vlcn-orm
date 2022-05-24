import fc from 'fast-check';
import { createCompiler } from '@aphro/schema';
import { Node, primitives, PrimitiveSubtype } from '@aphro/schema-api';
import { GenTypescriptMutations } from '../GenTypescriptMutations';
import mutationExtension from '@aphro/mutation-grammar';
import { removeSignature } from '@aphro/codegen';
import { algolTemplates } from '@aphro/codegen-api';

const grammarExtensions = [mutationExtension];
const { compileFromString } = createCompiler({ grammarExtensions });

test('All primitive field references can be used as inputs', () => {
  primitives.forEach(primitive => {
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
      genIt(compileFromString(schema)[1].nodes.Foo).contents,
      algolTemplates,
    );

    expect(contents).toEqual(`import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import Foo from "./Foo.js";
import { default as spec } from "./FooSpec.js";
import { Data } from "./Foo.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";

export default class FooMutations extends MutationsBase<Foo, Data> {
  private constructor(
    ctx: Context,
    mutator: ICreateOrUpdateBuilder<Foo, Data>
  ) {
    super(ctx, mutator);
  }

  static update(model: Foo) {
    return new FooMutations(model.ctx, new UpdateMutationBuilder(spec, model));
  }

  static creation(ctx: Context) {
    return new FooMutations(ctx, new CreateMutationBuilder(spec));
  }

  static deletion(model: Foo) {
    return new FooMutations(model.ctx, new DeleteMutationBuilder(spec, model));
  }

  create({ someField }: { someField: ${asTsType(primitive)} }): this {
    // BEGIN-MANUAL-SECTION
    // END-MANUAL-SECTION
    return this;
  }
}
`);
  });
});

test('All primitive types can be used as custom inputs', () => {
  primitives.forEach(primitive => {
    const schema = `
      Foo as Node {
      } & Mutations {
        create as Create {
          customField: ${primitive}
        }
      }
    `;
    const contents = removeSignature(
      genIt(compileFromString(schema)[1].nodes.Foo).contents,
      algolTemplates,
    );

    expect(contents).toEqual(`import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import Foo from "./Foo.js";
import { default as spec } from "./FooSpec.js";
import { Data } from "./Foo.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";

export default class FooMutations extends MutationsBase<Foo, Data> {
  private constructor(
    ctx: Context,
    mutator: ICreateOrUpdateBuilder<Foo, Data>
  ) {
    super(ctx, mutator);
  }

  static update(model: Foo) {
    return new FooMutations(model.ctx, new UpdateMutationBuilder(spec, model));
  }

  static creation(ctx: Context) {
    return new FooMutations(ctx, new CreateMutationBuilder(spec));
  }

  static deletion(model: Foo) {
    return new FooMutations(model.ctx, new DeleteMutationBuilder(spec, model));
  }

  create({ customField }: { customField: ${asTsType(primitive)} }): this {
    // BEGIN-MANUAL-SECTION
    // END-MANUAL-SECTION
    return this;
  }
}
`);
  });
});

test('All composite types can be used as inputs', () => {});

test('Node type names can be used as inputs', () => {
  fc.assert(
    fc.property(
      fc.stringOf(fc.constantFrom('a', 'b', 'c', 'd', 'e'), { maxLength: 6, minLength: 3 }),
      customName => {
        const schema = `
        Foo as Node {
        } & Mutations {
          create as Create {
            customField: ${customName}
          }
        }
      `;
        const contents = removeSignature(
          genIt(compileFromString(schema)[1].nodes.Foo).contents,
          algolTemplates,
        );

        expect(contents).toEqual(`import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import Foo from "./Foo.js";
import { default as spec } from "./FooSpec.js";
import { Data } from "./Foo.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";
import ${customName} from "./${customName}.js";
import { Data as ${customName}Data } from "./${customName}.js";

export default class FooMutations extends MutationsBase<Foo, Data> {
  private constructor(
    ctx: Context,
    mutator: ICreateOrUpdateBuilder<Foo, Data>
  ) {
    super(ctx, mutator);
  }

  static update(model: Foo) {
    return new FooMutations(model.ctx, new UpdateMutationBuilder(spec, model));
  }

  static creation(ctx: Context) {
    return new FooMutations(ctx, new CreateMutationBuilder(spec));
  }

  static deletion(model: Foo) {
    return new FooMutations(model.ctx, new DeleteMutationBuilder(spec, model));
  }

  create({
    customField,
  }: {
    customField: ${customName} | Changeset<${customName}, ${customName}Data>;
  }): this {
    // BEGIN-MANUAL-SECTION
    // END-MANUAL-SECTION
    return this;
  }
}
`);
      },
    ),
  );
});

function genIt(schema: Node) {
  return new GenTypescriptMutations('', schema).gen();
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
  }
}
