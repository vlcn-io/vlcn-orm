import { Context, IModel, ModelSpecWithCreate } from '@aphro/context-runtime-ts';
import { SourceQuery } from '../Query.js';
import SQLSourceExpression from './SQLSourceExpression.js';

export default class SQLSourceQuery<T extends IModel<Object>> extends SourceQuery<T> {
  constructor(ctx: Context, spec: ModelSpecWithCreate<T, Object>) {
    super(ctx, new SQLSourceExpression(ctx, spec, { what: 'model' }));
  }
}
