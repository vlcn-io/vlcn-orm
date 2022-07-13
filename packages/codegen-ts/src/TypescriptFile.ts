import { sign } from '@aphro/codegen';
import { CodegenFile, algolTemplates } from '@aphro/codegen-api';
// @ts-ignore
import prettier from 'prettier';

export default class TypescriptFile implements CodegenFile {
  #contents: string;
  readonly templates = algolTemplates;

  constructor(
    public readonly name: string,
    contents: string,
    public readonly isUnsigned: boolean = false,
    public readonly nochange: boolean = false,
  ) {
    this.#contents = contents;
  }

  get contents(): string {
    let contents = this.#contents;
    if (this.isUnsigned) {
      return prettier.format(contents, { parser: 'typescript' });
    }

    contents =
      `/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
` + this.#contents;

    return sign(prettier.format(contents, { parser: 'typescript' }), this.templates);
  }
}
