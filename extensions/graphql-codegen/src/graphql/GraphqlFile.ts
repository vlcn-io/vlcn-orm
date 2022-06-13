import { sign } from '@aphro/codegen';
import { CodegenFile, hashTemplates } from '@aphro/codegen-api';

export default class GraphQLFile implements CodegenFile {
  #contents: string;
  readonly templates = hashTemplates;

  constructor(
    public readonly name: string,
    contents: string,
    public readonly isUnsigned: boolean = false,
  ) {
    this.#contents = contents;
  }

  get contents(): string {
    let contents = this.#contents;
    return sign(contents, this.templates);
  }
}
