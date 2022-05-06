import { sign } from '@aphro/codegen';
import { CodegenFile, ALGOL_TEMPLATE } from '@aphro/codegen-api';
// @ts-ignore
import prettier from 'prettier';

export default class TypescriptFile implements CodegenFile {
  #contents: string;
  readonly signatureTemplate: string = ALGOL_TEMPLATE;

  constructor(public readonly name: string, contents: string) {
    this.#contents = contents;
  }

  get contents(): string {
    return sign(prettier.format(this.#contents, { parser: 'typescript' }), ALGOL_TEMPLATE);
  }
}
