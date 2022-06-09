import { CodegenStep, CodegenFile } from '@aphro/codegen-api';
import { Node } from '@aphro/schema-api';
import { Mutation } from '@aphro/mutation-grammar';
import { TypescriptFile, importsToString } from '@aphro/codegen-ts';
// TODO: tsImport should probably go into `codegen-ts`
import { tsImport } from '@aphro/schema';
// TODO: Import should probably go into `codegen-api`?
import { Import } from '@aphro/schema-api';
import { getArgNameAndType } from './shared.js';
import { upcaseAt } from '@strut/utils';
import * as ts from 'typescript';

/**
 * TODO:
 * We need to not generate this file only if it does not already exists.
 * If it does exist, we need to:
 * 1. Get the ast
 * 2. See what functions are exported
 * 3. Only generates those that are new
 */
export class GenTypescriptMutationImpls extends CodegenStep {
  static accepts(schema: Node): boolean {
    return Object.values(schema.extensions.mutations?.mutations || []).length > 0;
  }

  constructor(private schema: Node, private dest: string) {
    super();
  }

  gen(): CodegenFile {
    // load existing file if it exists.
    // condense imports since we'll want to add imports if we add impls...
    // `getCode` is partial if there was an existing file.
    // it'd be `append only` for new exports.
    // and `prepend only` for new imports
    // something like:
    // `
    // ${condenseImports(oldImports, collectImports)}
    // ${old code}
    // ${getMutationFuncs(omit funcs)}
    // `
    // gen should be async.
    return new TypescriptFile(
      this.schema.name + 'MutationsImpl.ts',
      `${importsToString(this.collectImports())}

${this.getCode()}
`,
      true,
    );
  }

  private getCode(): string {
    return Object.values(this.schema.extensions.mutations?.mutations || {})
      .map(m => this.getMutationFunctionDefCode(m))
      .join('\n\n');
  }

  private gatherAlreadyDefinedImpls(): Set<string> {
    const s: Set<string> = new Set();
    // tsd.createSourceFile('./DeckMutationsImpl.ts', fs.readFileSync('./DeckMutationsImpl.ts').toString(), tsd.ScriptTarget.ES2017, true);
    // source.forEachChild()
    // c.kind === ts.SyntaxKind.FunctionDeclaration
    // or + 1?
    // c.modifiers[0].kind === ts.SyntaxKind.ExportKeyword
    // or - 1?
    // c.name.escapedText.endsWith('Impl')
    // s.add(c.name.escapedText)
    // return s
    return s;
  }

  private getMutationFunctionDefCode(m: Mutation): string {
    const [destructured, _] = getArgNameAndType(this.schema, m.args, true);
    const casedName = upcaseAt(m.name, 0);
    // suffix with `Impl` so reserved words don't conflict
    return `export function ${m.name}Impl(mutator: Omit<IMutationBuilder<${this.schema.name}, Data>, 'toChangeset'>, ${destructured}: ${casedName}Args): void | Changeset<any>[] {
      // Use the provided mutator to make your desired changes.
      // e.g., mutator.set({name: "Foo" });
      // You do not need to return anything from this method. The mutator will track your changes.
      // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
    }`;
  }

  private collectImports(): Import[] {
    return [
      ...this.importArgTypes(),
      tsImport('{Changeset}', null, '@aphro/runtime-ts'),
      tsImport('{Data}', null, `./${this.schema.name}.js`),
      tsImport(this.schema.name, null, `./${this.schema.name}.js`),
      tsImport('{IMutationBuilder}', null, '@aphro/runtime-ts'),
    ];
  }

  private importArgTypes(): Import[] {
    return Object.values(this.schema.extensions.mutations?.mutations || {}).map(m => {
      const typeName = upcaseAt(m.name, 0) + 'Args';
      return tsImport(`{${typeName}}`, null, `./${this.schema.name}Mutations.js`);
    });
  }
}
