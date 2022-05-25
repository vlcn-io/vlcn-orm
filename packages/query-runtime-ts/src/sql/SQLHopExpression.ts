import { ModelSpec } from '@aphro/model-runtime-ts';
import { SID_of } from '@strut/sid';
import { ChunkIterable } from '../ChunkIterable.js';
import { HopExpression } from '../Expression.js';
import HopPlan from '../HopPlan.js';
import { HoistedOperations } from './SqlSourceExpression.js';

/**
 * This should be very similar to `SQLSourceExpression`
 * The only difference is that we're starting with something.
 *
 * SQLSource is:
 * `SELECT x FROM foo WHERE filters LIMIT limit ORDER BY order`
 *
 * SQLHop is:
 * ` --- WHERE filters LIMIT limit ORDER BY order` ?
 *
 * The hop exists in all aspects except its join. When the hop is folded
 * into the source expression is when the join is finally applied?
 *
 * Final join would look something like:
 * SELECT public.component.* FROM public.user
 *  JOIN public.deck ON public.deck."ownerId" = public.user.id
 *  JOIN public.slide ON public.slide."deckId" = public.deck.id
 *  JOIN public.component ON public.component."slideId" = public.slide.id
 *
 * Last hoisted join is what is selected from.
 *
 * If we're fetching edges along with edge traversals:
 * `SELECT public.component.*, public.slide.*`
 * (to fix 1+N query problem)
 *
 * So `spec and ops to sql` will have received the list of hops
 * in the source expression.
 *
 * It can follow this linked list to find the hops that are supposed to return
 * data and craft the initial select to respect that.
 *
 * Orders, offsets, limits in a hop?
 */
export default class SQLHopExpression<T> implements HopExpression<SID_of<any>, T> {
  readonly spec: ModelSpec<any, any>;
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
