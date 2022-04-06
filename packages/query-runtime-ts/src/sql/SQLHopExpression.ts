import { SID_of } from '@strut/sid';
import { ChunkIterable } from '../ChunkIterable.js';
import { HopExpression } from '../Expression.js';
import HopPlan from '../HopPlan.js';

export default class SQLHopExpression<T> implements HopExpression<SID_of<any>, T> {
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
