/**
 * How shall our mutators look? and work?
 *
 * Espeically in the face of rich clients and write through caching...
 */

import { CodegenStep, CodegenFile } from '@aphro/codegen-api';
import { Node } from '@aphro/schema-api';
import { TypescriptFile } from '@aphro/codegen';

export default class GenTypescriptMutator extends CodegenStep {
  static accepts(_schema: Node): boolean {
    return true;
  }

  constructor(private schema: Node) {
    super();
  }

  gen(): CodegenFile {
    return new TypescriptFile(this.schema.name + 'Mutations.ts', this.getCode());
  }

  private getCode(): string {
    return ``;
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
 */
