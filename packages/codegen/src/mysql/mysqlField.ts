import { Field } from "../../schema/parser/SchemaType.js";

export function fieldToMySqlType(field: Field): string {
  const type = field.type;
  // TODO: we should have an abstraction to convert from
  // Semantic type -> Storage type
  // Thus we don't have to have every semantic case covered for every backend.
  switch (type) {
    case "id":
      return "BIGINT UNSIGNED";
    case "primitive":
      switch (field.subtype) {
        case "int32":
          return "INT";
        case "float32":
          return "FLOAT";
        case "float64":
          return "DOUBLE";
        case "int64":
          return "BIGINT";
        case "uint64":
          return "BIGINT UNSIGNED";
        case "string":
          return "TEXT";
        case "bool":
          return "BOOLEAN";
      }
    case "map":
      return "JSON";
    case "naturalLanguage":
      // TODO: take length into account
      return "TEXT";
    case "array":
      return "ARRAY";
    case "enumeration":
      return "VARCHAR(255)";
    case "currency":
      return "FLOAT";
    case "timestamp":
      return "DATETIME";
  }
}
