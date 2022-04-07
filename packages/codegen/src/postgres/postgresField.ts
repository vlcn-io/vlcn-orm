import { Field } from '@aphro/schema-api';
import { fieldToMySqlType } from '../mysql/mysqlField.js';

export function fieldToPostgresType(field: Field): string {
  return fieldToMySqlType(field);
}
