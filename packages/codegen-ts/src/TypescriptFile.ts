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
    const content = sign(prettier.format(this.#contents, { parser: 'typescript' }), this.templates);

    return content;
  }
}
