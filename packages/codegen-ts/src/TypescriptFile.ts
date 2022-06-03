import { sign } from '@aphro/codegen';
import { CodegenFile, algolTemplates } from '@aphro/codegen-api';
// @ts-ignore
import prettier from 'prettier';

export default class TypescriptFile implements CodegenFile {
  #contents: string;
  readonly templates = algolTemplates;

  constructor(public readonly name: string, contents: string) {
    this.#contents = contents;
  }

  get contents(): string {
    this.#contents =
      `/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated \`BEGIN-MANUAL-SECTION\` and
 * \`END-MANUAL-SECTION\` markers.
 */
` + this.#contents;
    const content = sign(prettier.format(this.#contents, { parser: 'typescript' }), this.templates);

    return content;
  }
}
