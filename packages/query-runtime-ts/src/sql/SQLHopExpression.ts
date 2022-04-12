import { ModelSpec } from '@aphro/model-runtime-ts';
import { SID_of } from '@strut/sid';
import { ChunkIterable } from '../ChunkIterable.js';
import { HopExpression } from '../Expression.js';
import HopPlan from '../HopPlan.js';
import { HoistedOperations } from './SqlSourceExpression.js';

export default class SQLHopExpression<T> implements HopExpression<SID_of<any>, T> {
  readonly spec: ModelSpec<any>;
  readonly ops: HoistedOperations;

  chainAfter(iterable: ChunkIterable<SID_of<any>>): ChunkIterable<T> {
    throw new Error('unimplemented');
  }
  /**
   * Optimizes the current plan (plan) and folds in the nxet hop (nextHop) if possible.
   */
  optimize(plan: HopPlan, nextHop?: HopPlan): HopPlan {
    throw new Error('unimplemented');
  }

  type: 'hop' = 'hop';
}
