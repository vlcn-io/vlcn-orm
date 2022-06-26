import { Context, IModel, ModelSpecWithCreate } from '@aphro/context-runtime-ts';
import { SourceQuery } from '../Query.js';
import MemorySourceExpression from './MemorySourceExpression.js';

export default class MemorySourceQuery<T extends IModel<Object>> extends SourceQuery<T> {
  constructor(ctx: Context, spec: ModelSpecWithCreate<T, Object>) {
    super(ctx, new MemorySourceExpression(ctx, spec, { what: 'model' }));
  }
}
