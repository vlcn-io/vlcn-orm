import { invariant } from '@strut/utils';
import { HopExpression } from '../Expression.js';
import { HopQuery, Query } from '../Query.js';
import { EdgeSpec } from '@aphro/schema-api';
import { Context } from '@aphro/context-runtime-ts';
import SQLHopExpression from './SQLHopExpression.js';

export default class SQLHopQuery<TIn, TOut> extends HopQuery<TIn, TOut> {
  /*
  A SQL hop query means that the next thing is SQL backed.
  We'll take source and see what the source is to determine what HOP
  expression to construct?
  */
  static create<TIn, TOut>(ctx: Context, sourceQuery: Query<TIn>, edge: EdgeSpec) {
    // based on source and dest spec, determine the appropriate hop expression
    if (edge.source.storage.type === 'sql') {
      // Is the query layer doing this correctly?
      invariant(edge.dest.storage.type === 'sql', 'SQLHopQuery created for non-sql destination');

      // If we're the same storage on the same DB, we can use a join expression
      if (edge.source.storage.db === edge.dest.storage.db) {
        return new SQLHopQuery<TIn, TOut>(
          ctx,
          sourceQuery,
          new SQLHopExpression(ctx, edge, { what: 'model' }),
        );
      }
    }
    return new SQLHopQuery<TIn, TOut>(ctx, sourceQuery, createChainedHopExpression(edge));
  }
}

function createChainedHopExpression<TIn, TOut>(edge: EdgeSpec): HopExpression<TIn, TOut> {
  throw new Error('In memory hop not yet supported');
}
