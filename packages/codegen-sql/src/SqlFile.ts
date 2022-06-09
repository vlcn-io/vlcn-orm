import { sign } from '@aphro/codegen';
import { CodegenFile, sqlTemplates } from '@aphro/codegen-api';
import { format } from 'sql-formatter';

export default class SqlFile implements CodegenFile {
  #contents: string;
  readonly templates = sqlTemplates;

  constructor(
    public readonly name: string,
    contents: string,
    private dialect: string,
    public readonly isUnsigned: boolean = false,
  ) {
    this.#contents = contents;
  }

  get contents(): string {
    return sign(
      format(this.#contents, { language: this.#dialectToLanguage() as any }),
      this.templates,
    );
  }

  #dialectToLanguage() {
    if (this.dialect === 'postgres') {
      return 'postgresql';
    }

    return this.dialect;
  }
}
