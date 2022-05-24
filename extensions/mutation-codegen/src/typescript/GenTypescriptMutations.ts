/**
 * How shall our mutators look? and work?
 *
 * Espeically in the face of rich clients and write through caching...
 */

import { CodegenStep, CodegenFile } from '@aphro/codegen-api';
import { Node } from '@aphro/schema-api';
import { Mutation, MutationArgDef, mutationFn, MutationVerb } from '@aphro/mutation-grammar';
import { typeDefToTsType, TypescriptFile, importsToString } from '@aphro/codegen-ts';
// TODO: tsImport should probably go into `codegen-ts`
import { tsImport, nodeFn } from '@aphro/schema';
// TODO: Import should probably go into `codegen-api`?
import { Import } from '@aphro/schema-api';

export class GenTypescriptMutations extends CodegenStep {
  static accepts(schema: Node): boolean {
    return Object.values(schema.extensions.mutations?.mutations || []).length > 0;
  }

  constructor(private dest: string, private schema: Node) {
    super();
  }

  gen(): CodegenFile {
    return new TypescriptFile(
      this.schema.name + 'Mutations.ts',
      `${importsToString(this.collectImports())}

${this.getCode()}
`,
    );
  }

  private getCode(): string {
    return `
    // BEGIN-MANUAL-SECTION: [module-level]
    // Manual section for any new imports / export / top level things
    // END-MANUAL-SECTION

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

  private collectImports(): Import[] {
    return [
      tsImport('{ICreateOrUpdateBuilder}', null, '@aphro/runtime-ts'),
      tsImport('{Context}', null, '@aphro/runtime-ts'),
      tsImport('{MutationsBase}', null, '@aphro/runtime-ts'),
      tsImport(this.schema.name, null, `./${this.schema.name}.js`),
      tsImport(this.schema.name, null, `./${this.schema.name}.js`),
      tsImport('{default}', 'spec', `./${nodeFn.specName(this.schema.name)}.js`),
      tsImport('{Data}', null, `./${this.schema.name}.js`),
      tsImport('{UpdateMutationBuilder}', null, '@aphro/runtime-ts'),
      tsImport('{CreateMutationBuilder}', null, '@aphro/runtime-ts'),
      tsImport('{DeleteMutationBuilder}', null, '@aphro/runtime-ts'),
      tsImport('{Changeset}', null, '@aphro/runtime-ts'),
      ...this.collectImportsForMutations(),
    ];
  }

  private getFactoriesCode(verb: MutationVerb): string {
    return Object.values(this.schema.extensions.mutations?.mutations || {})
      .filter(m => m.verb === verb)
      .map(m => this.getFactoryCode(verb, m))
      .join('\n\n');
  }

  private getFactoryCode(verb: MutationVerb, m: Mutation): string {
    switch (verb) {
      case 'create':
        return `static ${m.name}(ctx: Context, ${this.getArgsCode(m.args, false)}): Mutations {
          return new Mutations(ctx, new CreateMutationBuilder(spec)).${m.name}(args)
        }`;
      case 'update':
        return `static ${m.name}(model: ${this.schema.name}, ${this.getArgsCode(
          m.args,
          false,
        )}): Mutations {
          return new Mutations(model.ctx, new UpdateMutationBuilder(spec, model)).${m.name}(args)
        }`;
      case 'delete':
        return `static ${m.name}(model: ${this.schema.name}, ${this.getArgsCode(
          m.args,
          false,
        )}): Mutations {
          return new Mutations(model.ctx, new DeleteMutationBuilder(spec, model)).${m.name}(args)
        }`;
    }
  }

  private getMutationMethodsCode(): string {
    return Object.values(this.schema.extensions.mutations?.mutations || {})
      .map(m => this.getMutationMethodCode(m))
      .join('\n\n');
  }

  private getMutationMethodCode(m: Mutation): string {
    return `${m.name}(${this.getArgsCode(m.args)}): this {
      // BEGIN-MANUAL-SECTION: [${m.name}]
      // END-MANUAL-SECTION
      return this;
    }`;
  }

  private getArgsCode(
    args: { [key: string]: MutationArgDef },
    desturcture: boolean = true,
  ): string {
    const fullArgsDefs = Object.values(args).map(a =>
      mutationFn.transformMaybeQuickToFull(this.schema, a),
    );

    const type =
      '{' +
      fullArgsDefs
        .map(a => {
          return a.name + ': ' + typeDefToTsType(a.typeDef);
        })
        .join(',') +
      '}';
    let argName = 'args';
    if (desturcture) {
      argName = '{' + fullArgsDefs.map(a => a.name).join(',') + '}';
    }
    return `${argName}: ${type}`;
  }

  private collectImportsForMutations(): Import[] {
    return Object.values(this.schema.extensions.mutations?.mutations || {}).flatMap(m =>
      this.collectImportsForArgs(m.args),
    );
  }

  private collectImportsForArgs(args: { [key: string]: MutationArgDef }): Import[] {
    const fullArgsDefs = Object.values(args).map(a =>
      mutationFn.transformMaybeQuickToFull(this.schema, a),
    );
    return fullArgsDefs.flatMap(
      a =>
        a.typeDef
          .flatMap(td =>
            td.type === 'type'
              ? typeof td.name === 'string' && td.name !== 'null'
                ? [
                    tsImport(td.name, null, `./${td.name}.js`),
                    tsImport('{Data}', td.name + 'Data', `./${td.name}.js`),
                  ]
                : null
              : null,
          )
          .filter(td => td != null) as Import[],
    );
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
