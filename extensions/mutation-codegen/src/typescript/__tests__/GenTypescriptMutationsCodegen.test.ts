import fc from 'fast-check';
import { createCompiler } from '@aphro/schema';
import { Node, primitives, PrimitiveSubtype } from '@aphro/schema-api';
import { GenTypescriptMutations } from '../GenTypescriptMutations';
import mutationExtension from '@aphro/mutation-grammar';
import { removeSignature } from '@aphro/codegen';
import { ALGOL_TEMPLATE } from '@aphro/codegen-api';

const grammarExtensions = [mutationExtension];
const { compileFromString } = createCompiler({ grammarExtensions });

test('All primitive field references can be used as inputs', () => {
  primitives.forEach(primitive => {
    const schema = `
      Foo as Node {
        someField: ${primitive}
      } & Mutations {
        create {
          someField
        }
      }
    `;
    const contents = removeSignature(
      genIt(compileFromString(schema)[1].nodes.Foo).contents,
      ALGOL_TEMPLATE,
    );

    expect(contents).toEqual(`import { ICreateOrUpdateBuilder } from \"@aphro/runtime-ts\";
import { Context } from \"@aphro/runtime-ts\";
import { MutationsBase } from \"@aphro/runtime-ts\";
import Foo from \"./Foo.js\";
import { default as spec } from \"./FooSpec.js\";
import { Data } from \"./Foo.js\";
import { UpdateMutationBuilder } from \"@aphro/runtime-ts\";
import { CreateMutationBuilder } from \"@aphro/runtime-ts\";
import { DeleteMutationBuilder } from \"@aphro/runtime-ts\";

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

function genIt(schema: Node) {
  return new GenTypescriptMutations(schema).gen();
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
