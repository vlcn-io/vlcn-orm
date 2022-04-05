import { CodegenFile } from "../CodegenFile.js";
import CodegenStep from "../CodegenStep.js";
import SqlFile from "..//SqlFile.js";
import { fieldToPostgresType } from "./postgresField.js";
import { Node } from "../../schema/parser/SchemaType.js";

export default class GenPostgresTableSchema extends CodegenStep {
  static accepts(schema: Node): boolean {
    return schema.storage.engine === "postgres";
  }

  constructor(private schema: Node) {
    super();
  }

  gen(): CodegenFile {
    return new SqlFile(
      this.schema.name + ".pg.sql",
      `CREATE TABLE ${this.schema.name} (
        ${this.getColumnDefinitionsCode()}
        ${this.getPrimaryKeyCode()}
        ${this.getIndexDefinitionsCode()}
      );`
    );
  }

  private getColumnDefinitionsCode(): string {
    const fields = Object.values(this.schema.fields);

    return fields.map((f) => `${f.name} ${fieldToPostgresType(f)}`).join(",\n");
  }

  private getPrimaryKeyCode(): string {
    return "";
  }

  private getIndexDefinitionsCode(): string {
    return "";
  }
}
