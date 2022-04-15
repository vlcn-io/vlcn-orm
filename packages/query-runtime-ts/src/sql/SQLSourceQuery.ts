import { ModelSpec } from '@aphro/model-runtime-ts';
import { SourceQuery } from '../Query.js';
import SQLSourceExpression, { SQLResult } from './SqlSourceExpression.js';

export default class SQLSourceQuery<T> extends SourceQuery<T> {
  constructor(spec: ModelSpec<T, any>) {
    super(new SQLSourceExpression(spec, { what: 'model' }));
  }
}
