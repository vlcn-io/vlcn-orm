import { CodegenFile, SQL_TEMPLATE, sign } from "./CodegenFile.js";
import { format } from "sql-formatter";

export default class SqlFile implements CodegenFile {
  #contents: string;

  constructor(public readonly name: string, contents: string) {
    this.#contents = contents;
  }

  get contents(): string {
    return sign(format(this.#contents), SQL_TEMPLATE);
  }
}
