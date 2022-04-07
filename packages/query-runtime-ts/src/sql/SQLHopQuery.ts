import { invariant } from '@strut/utils';
import { HopExpression } from '../Expression.js';
import { HopQuery, Query } from '../Query.js';
import { ModelSpec, StorageConfig } from '@aphro/model-runtime-ts';

export default class SQLHopQuery<TIn, TOut> extends HopQuery<TIn, TOut> {
  /*
  A SQL hop query means that the next thing is SQL backed.
  We'll take source and see what the source is to determine what HOP
  expression to construct?
  */
  static create<TIn, TOut>(
    sourceQuery: Query<TIn>,
    sourceSpec: ModelSpec<TIn>,
    destSpec: ModelSpec<TOut>,
  ) {
    // based on source and dest spec, determine the appropriate hop expression
    return new SQLHopQuery(sourceQuery, createExpression(sourceSpec, destSpec));
  }
}

function createExpression<TIn, TOut>(
  sourceSpec: ModelSpec<TIn>,
  destSpec: ModelSpec<TOut>,
): HopExpression<TIn, TOut> {
  if (sourceSpec.storage.type === 'sql') {
    invariant(destSpec.storage.type === 'sql', 'SQLHopQuery created for non-sql destination');

    // If we're the same storage on the same DB, we can use a join expression
    if (sourceSpec.storage.db === destSpec.storage.db) {
      return createJoinExpression(sourceSpec.storage, destSpec.storage);
    }
  }

  return createChainedHopExpression(sourceSpec.storage, destSpec.storage);
}

function createJoinExpression<TIn, TOut>(
  sourceDescriptor: StorageConfig,
  destDescriptor: StorageConfig,
): HopExpression<TIn, TOut> {
  throw new Error('Join not yet supported');
}

function createChainedHopExpression<TIn, TOut>(
  sourceDescriptor: StorageConfig,
  destDescriptor: StorageConfig,
): HopExpression<TIn, TOut> {
  throw new Error('In memory hop not yet supported');
}
