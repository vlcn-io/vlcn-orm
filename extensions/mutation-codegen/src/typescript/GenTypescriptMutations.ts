/**
 * How shall our mutators look? and work?
 *
 * Espeically in the face of rich clients and write through caching...
 */

import { CodegenStep, CodegenFile } from '@aphro/codegen-api';
import { SchemaEdge, SchemaNode } from '@aphro/schema-api';
import { Mutation, MutationVerb } from '@aphro/mutation-grammar';
import { TypescriptFile, importsToString } from '@aphro/codegen-ts';
// TODO: tsImport should probably go into `codegen-ts`
import { tsImport, nodeFn } from '@aphro/schema';
// TODO: Import should probably go into `codegen-api`?
import { Import } from '@aphro/schema-api';

import { collectImportsForMutations, getArgNameAndType } from './shared.js';
import { upcaseAt } from '@strut/utils';

export class GenTypescriptMutations extends CodegenStep {
  static accepts(schema: SchemaNode | SchemaEdge): boolean {
    return Object.values(schema.extensions.mutations?.mutations || []).length > 0;
  }

  private schema: SchemaNode | SchemaEdge;
  constructor(opts: {
    nodeOrEdge: SchemaNode | SchemaEdge;
    edges: { [key: string]: SchemaEdge };
    dest: string;
  }) {
    super();
    this.schema = opts.nodeOrEdge;
  }

  async gen(): Promise<CodegenFile> {
    return new TypescriptFile(
      this.schema.name + 'Mutations.ts',
      `${importsToString(this.collectImports())}

${this.getCode()}
`,
    );
  }

  private getCode(): string {
    return `
    ${this.getArgTypesCode()}
    class Mutations extends MutationsBase<${this.schema.name}, Data> {
      constructor(
        ctx: Context,
        mutator: ICreateOrUpdateBuilder<${this.schema.name}, Data>
      ) {
        super(ctx, mutator);
      }

      ${this.getMutationMethodsCode()}
    }

    export default class ${this.schema.name}Mutations {
      ${this.getFactoriesCode('create')}
      ${this.getFactoriesCode('update')}
      ${this.getFactoriesCode('delete')}
    }
    `;
  }

  private getArgTypesCode(): string {
    return Object.values(this.schema.extensions.mutations?.mutations || {})
      .map(m => {
        const [argName, argType] = getArgNameAndType(this.schema, m.args, false);
        return `export type ${upcaseAt(m.name, 0)}Args = ${argType}`;
      })
      .join('\n\n');
  }

  private collectImports(): Import[] {
    return [
      tsImport('*', 'impls', `./${this.schema.name}MutationsImpl.js`),
      tsImport('{ICreateOrUpdateBuilder}', null, '@aphro/runtime-ts'),
      tsImport('{Context}', null, '@aphro/runtime-ts'),
      tsImport('{MutationsBase}', null, '@aphro/runtime-ts'),
      tsImport(this.schema.name, null, `./${this.schema.name}.js`),
      tsImport('{default}', 'spec', `./${nodeFn.specName(this.schema.name)}.js`),
      tsImport('{Data}', null, `./${this.schema.name}.js`),
      tsImport('{UpdateMutationBuilder}', null, '@aphro/runtime-ts'),
      tsImport('{CreateMutationBuilder}', null, '@aphro/runtime-ts'),
      tsImport('{DeleteMutationBuilder}', null, '@aphro/runtime-ts'),
      tsImport('{SID_of}', null, '@aphro/runtime-ts'),
      tsImport('{Changeset}', null, '@aphro/runtime-ts'),
      ...collectImportsForMutations(this.schema),
    ];
  }

  private getFactoriesCode(verb: MutationVerb): string {
    return Object.values(this.schema.extensions.mutations?.mutations || {})
      .filter(m => m.verb === verb)
      .map(m => this.getFactoryCode(verb, m))
      .join('\n\n');
  }

  private getFactoryCode(verb: MutationVerb, m: Mutation): string {
    const nameCased = upcaseAt(m.name, 0);
    switch (verb) {
      case 'create':
        return `static ${m.name}(ctx: Context, args: ${nameCased}Args): Mutations {
          return new Mutations(ctx, new CreateMutationBuilder(ctx, spec)).${m.name}(args)
        }`;
      case 'update':
        return `static ${m.name}(model: ${this.schema.name}, args: ${nameCased}Args): Mutations {
          return new Mutations(model.ctx, new UpdateMutationBuilder(model.ctx, spec, model)).${m.name}(args)
        }`;
      case 'delete':
        return `static ${m.name}(model: ${this.schema.name}, args: ${nameCased}Args): Mutations {
          return new Mutations(model.ctx, new DeleteMutationBuilder(model.ctx, spec, model)).${m.name}(args)
        }`;
    }
  }

  private getMutationMethodsCode(): string {
    return Object.values(this.schema.extensions.mutations?.mutations || {})
      .map(m => this.getMutationMethodCode(m))
      .join('\n\n');
  }

  private getMutationMethodCode(m: Mutation): string {
    const casedName = upcaseAt(m.name, 0);
    return `${m.name}(args: ${casedName}Args): this {
      const extraChangesets = impls.${m.name}Impl(this.mutator, args);
      this.mutator.addExtraChangesets(extraChangesets || undefined);
      return this;
    }`;
  }
}

/**
 * Whats it look like?
 *
 * Do we allow mutators or only actions?
 *
 * Do we create a mutator?
 * Wouldn't actions use the mutators to commit changes?
 * And the mutator would create the query, invoke the db resolver and such.
 *
 * class DeckMutations {
 *   private mutator: ICreateOrUpdateBuilder<Deck>;
 *
 *   static for(deck?: Deck) {
 *     if (deck)
 *       return new DeckMutations(new UpdateMutator(deck));
 *     return new DeckMutations(new CreateMutator());
 *   }
 *
 *   updateName(name: string): DeckMutations {
 *     // Technically we should call into a trait.
 *     this.mutator.set({
 *       name,
 *     });
 *     return this;
 *   }
 * }
 */
