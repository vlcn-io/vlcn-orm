import { SchemaFile, ValidationError } from '@aphro/schema-api';

export default function validate(schemaFile: SchemaFile): ValidationError[] {
  return [];
}

export function stopsCodegen(error: ValidationError): boolean {
  return error.severity === 'error';
}

/*
- Validate imports
- Validate id_of
- Validate inbound and outbound edges

SQL:
- Validate indexing of fields (foreign key, junction)
*/
