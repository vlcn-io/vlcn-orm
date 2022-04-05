import { CodegenFile } from "../CodegenFile.js";
import CodegenStep from "../CodegenStep.js";
import { fieldToMySqlType } from "./mysqlField.js";
import SqlFile from "../SqlFile.js";
import { Node } from "../../schema/parser/SchemaType.js";

export default class GenMySqlTableSchema extends CodegenStep {
  static accepts(schema: Node): boolean {
    return schema.storage.engine === "mysql";
  }

  constructor(private schema: Node) {
    super();
  }

  gen(): CodegenFile {
    return new SqlFile(
      this.schema.name + ".my.sql",
      `CREATE TABLE ${this.schema.name} (
        ${this.getColumnDefinitionsCode()}
        ${this.getPrimaryKeyCode()}
        ${this.getIndexDefinitionsCode()}
      );`
    );
  }

  private getColumnDefinitionsCode(): string {
    const fields = Object.values(this.schema.fields);

    return fields.map((f) => `${f.name} ${fieldToMySqlType(f)}`).join(",\n");
  }

  private getPrimaryKeyCode(): string {
    return "";
  }

  private getIndexDefinitionsCode(): string {
    return "";
  }
}
