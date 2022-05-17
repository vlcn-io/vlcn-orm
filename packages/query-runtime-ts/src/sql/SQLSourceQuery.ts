import { Context } from '@aphro/context-runtime-ts';
import { IModel, ModelSpec } from '@aphro/model-runtime-ts';
import { SourceQuery } from '../Query.js';
import SQLSourceExpression from './SqlSourceExpression.js';

export default class SQLSourceQuery<T extends IModel<Object>> extends SourceQuery<T> {
  constructor(ctx: Context, spec: ModelSpec<T, Object>) {
    super(ctx, new SQLSourceExpression(ctx, spec, { what: 'model' }));
  }
}
