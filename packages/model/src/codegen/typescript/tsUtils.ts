import { Field, RemoveNameField } from "../../schema/parser/SchemaType";

function fieldToTsType(field: RemoveNameField<Field>): string {
  switch (field.type) {
    case "id":
      // TODO: pull in the correct id type.
      return "SID_of<any>";
    case "naturalLanguage":
      return "string";
    case "enumeration":
      return field.keys.join("|");
    case "currency":
    case "timestamp":
      return "number";
    case "primitive":
      switch (field.subtype) {
        case "bool":
          return "boolean";
        case "int32":
        case "float32":
        case "uint32":
          return "number";
        // since JS can't represent 64 bit numbers -- 53 bits is js max int.
        case "int64":
        case "float64":
        case "uint64":
        case "string":
          return "string";
      }
    case "map":
      return `ReadonlyMap<${fieldToTsType(field.keys)}, ${fieldToTsType(
        field.values
      )}>`;
  }

  throw new Error(
    `Cannot convert from ${field.type} of ${JSON.stringify(
      field
    )} to a typescript type`
  );
}

export { fieldToTsType };
