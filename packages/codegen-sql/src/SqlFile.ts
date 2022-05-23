import { sign } from '@aphro/codegen';
import { CodegenFile, SQL_TEMPLATE } from '@aphro/codegen-api';
import { format } from 'sql-formatter';

export default class SqlFile implements CodegenFile {
  #contents: string;
  readonly signatureTemplate: string = SQL_TEMPLATE;

  constructor(public readonly name: string, contents: string, private dialect: string) {
    this.#contents = contents;
  }

  get contents(): string {
    return sign(
      format(this.#contents, { language: this.#dialectToLanguage() as any }),
      SQL_TEMPLATE,
    );
  }

  #dialectToLanguage() {
    if (this.dialect === 'postgres') {
      return 'postgresql';
    }

    return this.dialect;
  }
}
