import { Context } from '@aphro/context-runtime-ts';
import { Expression } from './Expression.js';
import { DerivedQuery, Query } from './Query.js';

export default class IterableDerivedQuery<TOut> extends DerivedQuery<TOut> {
  constructor(ctx: Context, priorQuery: Query<any>, expression: Expression) {
    super(ctx, priorQuery, expression);
  }

  protected derive<TNOut>(expression: Expression): ThisType<TNOut> {
    return new IterableDerivedQuery(this.ctx, this, expression);
  }
}
