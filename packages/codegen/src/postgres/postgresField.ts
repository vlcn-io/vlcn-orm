import { Field } from '@aphro/schema';
import { fieldToMySqlType } from '../mysql/mysqlField.js';

export function fieldToPostgresType(field: Field): string {
  return fieldToMySqlType(field);
}
