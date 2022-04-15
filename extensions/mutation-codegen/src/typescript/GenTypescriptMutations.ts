/**
 * How shall our mutators look? and work?
 *
 * Espeically in the face of rich clients and write through caching...
 */

import { CodegenStep, CodegenFile } from '@aphro/codegen-api';
import { Node } from '@aphro/schema-api';
import { Mutation, MutationArgDef, mutationFn } from '@aphro/mutation-grammar';

export class GenTypescriptMutations extends CodegenStep {
  static accepts(_schema: Node): boolean {
    return true;
  }

  constructor(private schema: Node) {
    super();
  }

  gen(): CodegenFile {
    throw new Error('TypescriptFile needs to be moved out of codegen.');
    // return new TypescriptFile(this.schema.name + 'Mutations.ts', this.getCode());
  }

  private getCode(): string {
    return `class ${this.schema.name}Mutations {
      constructor(
        private mutator: ICreateOrUpdateBuilder<Data, ${this.schema.name}>
      ) {}

      static for(model?: ${this.schema.name}) {
        if (model) {
          return new ${this.schema.name}Mutations(new UpdateMutationBuilder(model))
        }
        return new ${this.schema.name}Mutations(new CreateMutationBuilder());
      }

      ${this.getMutationMethodsCode()}
    }`;
  }

  private getMutationMethodsCode(): string {
    return Object.values(this.schema.extensions.mutations?.mutations || {})
      .map(m => this.getMutationMethodCode(m))
      .join('\n');
  }

  private getMutationMethodCode(m: Mutation): string {
    return `${m.name}(${this.getArgsCode(m.args)}): this {
      // BEGIN-MANUAL-SECTION
      // END-MANUAL-SECTION
      return this;
    }`;
  }

  private getArgsCode(args: { [key: string]: MutationArgDef }): string {
    const fullArgsDefs = Object.values(args).map(a =>
      mutationFn.transformMaybeQuickToFull(this.schema, a),
    );
    return '';
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
