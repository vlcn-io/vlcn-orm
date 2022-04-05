import { Field } from "../../schema/parser/SchemaType.js";
import { fieldToMySqlType } from "codegen/mysql/mysqlField.js";

export function fieldToPostgresType(field: Field): string {
  return fieldToMySqlType(field);
}
