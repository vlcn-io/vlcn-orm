import { CodegenStep, CodegenFile, generatedDir } from '@aphro/codegen-api';
import { SchemaEdge, SchemaNode } from '@aphro/schema-api';
import { Mutation } from '@aphro/mutation-grammar';
import { TypescriptFile, importsToString } from '@aphro/codegen-ts';
// TODO: tsImport should probably go into `codegen-ts`
import { tsImport } from '@aphro/schema';
// TODO: Import should probably go into `codegen-api`?
import { Import } from '@aphro/schema-api';
import { getArgNameAndType } from './shared.js';
import { upcaseAt } from '@strut/utils';
import * as fs from 'fs';
import * as path from 'path';
import featureGates from '@aphro/feature-gates';

import { extractors, toAst } from '@aphro/parse-ts';
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
  static accepts(schema: SchemaNode | SchemaEdge): boolean {
    return (
      featureGates.NAMED_MUTATIONS &&
      Object.values(schema.extensions.mutations?.mutations || []).length > 0
    );
  }

  private schema: SchemaNode | SchemaEdge;
  private dest: string;
  constructor(opts: {
    nodeOrEdge: SchemaNode | SchemaEdge;
    edges: { [key: string]: SchemaEdge };
    dest: string;
  }) {
    super();
    this.schema = opts.nodeOrEdge;
    this.dest = opts.dest;
  }

  async gen(): Promise<CodegenFile> {
    const fileName = this.schema.name + 'MutationsImpl.ts';
    let priorContents: string | null = null;
    try {
      priorContents = await fs.promises.readFile(path.join(this.dest, fileName), {
        encoding: 'utf8',
      });
    } catch (e) {}

    if (priorContents != null) {
      const priorExports = extractors.exports(toAst.stringToAst(fileName, priorContents));
      // const priorImports = extractImports(priorContents).map(toTsImport);
      return new TypescriptFile(
        fileName,
        `${priorContents}
${this.getCode(priorExports)}
`,
        true,
      );
    }

    return new TypescriptFile(
      fileName,
      `${importsToString(this.collectImports())}

${this.getCode([])}
`,
      true,
    );
  }

  private getCode(priorExports: ts.FunctionDeclaration[]): string {
    const ignore: Set<string> = new Set(priorExports.map(e => e.name?.escapedText as string));
    return Object.values(this.schema.extensions.mutations?.mutations || {})
      .filter(m => !ignore.has(m.name + 'Impl'))
      .map(m => this.getMutationFunctionDefCode(m))
      .join('\n\n');
  }

  private getMutationFunctionDefCode(m: Mutation): string {
    const [destructured, _] = getArgNameAndType(this.schema, m.args, true);
    const casedName = upcaseAt(m.name, 0);
    // suffix with `Impl` so reserved words don't conflict
    return `export function ${m.name}Impl(${
      m.verb !== 'create' ? `model: ${this.schema.name}, ` : ''
    }mutator: Omit<IMutationBuilder<${
      this.schema.name
    }, Data>, 'toChangeset'>, ${destructured}: ${casedName}Args): void | Changeset<any, any>[] {
      // Use the provided mutator to make your desired changes.
      // e.g., mutator.set({name: "Foo" });
      // You do not need to return anything from this method. The mutator will track your changes.
      // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
      throw new Error('You must implement the mutation ${m.name} for schema ${
      this.schema.name
    } in ${this.schema.name}MutationsImpl.ts');
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
      return tsImport(`{${typeName}}`, null, `./${generatedDir}/${this.schema.name}Mutations.js`);
    });
  }
}
