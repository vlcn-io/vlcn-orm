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
    return sign(format(this.#contents, { language: this.dialect as any }), SQL_TEMPLATE);
  }
}
