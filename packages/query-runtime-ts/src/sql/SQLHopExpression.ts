import { ModelSpec } from '@aphro/model-runtime-ts';
import { EdgeSpec } from '@aphro/schema-api';
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
 *
 * Hop cases:
 *  No limit on non terminal hops:
 *   Field:
 *   SELECT B.* FROM A JOIN B on A.field = B.id
 *   Fk:
 *   SELECT B.* FROM A JOIN B on A.id = B.fk
 *   Jx (forward):
 *   SELECT B.* FROM A JOIN Jx on A.id = Jx.id1 JOIN B on B.id = Jx.id2
 *   Jx (reverse):
 *   SELECT B.* FROM A JOIN Jx ON A.id = Jx.id2 JOIN B on B.id = Jx.id1
 *
 *  filters & order bys on intermediate hops are fine to apply at the end of the main select.
 *
 *  Limit on non terminal hop:
 *   Field:
 *   SELECT B.* FROM (SELECT * FROM A LIMIT 10) as Ass JOIN B on Ass.field = B.id
 *
 * Limits on non-terminal hops just switch the table from "TABLE_NAME" to "(SELECT * FROM TABLE_NAME LIMIT X) AS TABLE_NAMEss"
 *
 */
export default class SQLHopExpression<TIn, TOut> implements HopExpression<TIn, TOut> {
  readonly spec: ModelSpec<any, any>;
  readonly ops: HoistedOperations;

  constructor(private edge: EdgeSpec) {}

  chainAfter(iterable: ChunkIterable<TIn>): ChunkIterable<TOut> {
    // Chain after is just...
    // SELECT projection FROM foo WHERE id IN (chunk of ids)
    // We'd need a SQLHopChunkIterable to which we pass the source iterable
    // and which would then `specAndOpsToSQL` based on the hoisted operations + incoming chunk
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
