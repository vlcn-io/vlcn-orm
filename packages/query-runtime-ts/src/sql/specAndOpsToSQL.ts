import { ModelSpec } from '@aphro/model-runtime-ts';
import { HoistedOperations } from './SqlSourceExpression.js';

// given a model spec and hoisted operations, return the SQL query
export default function specAndOpsToSQL(spec: ModelSpec<any>, ops: HoistedOperations): string {
  return '';
  // return sql('');
}
