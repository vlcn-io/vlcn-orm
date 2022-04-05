import { SchemaFile } from "../parser/SchemaType.js";

export type ValidationError = {
  message: string;
  severity: "warning" | "advice" | "error";
  type:
    | "duplicate-nodes"
    | "duplicate-edges"
    | "duplicate-fields"
    | "duplicate-ob-edges"
    | "duplicate-ib-edges"
    | "duplicate-extensions"
    | "duplicate-traits";
};

export default function validate(schemaFile: SchemaFile): ValidationError[] {
  return [];
}

export function stopsCodegen(error: ValidationError): boolean {
  return error.severity === "error";
}

/*
- Validate imports
- Validate id_of
- Validate inbound and outbound edges

SQL:
- Validate indexing of fields (foreign key, junction)
*/
