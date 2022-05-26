import { Context } from '@aphro/context-runtime-ts';
import { NodeSpec } from '@aphro/schema-api';
import { ChunkIterable } from '../ChunkIterable';
import HopPlan from '../HopPlan';
import Plan, { IPlan } from '../Plan';
import {
  after,
  before,
  Expression,
  filter,
  orderBy,
  SourceExpression,
  take,
} from '../Expression.js';
import SQLHopExpression from './SQLHopExpression';
import { ModelFieldGetter } from '../Field';

export type HoistedOperations = {
  filters?: readonly ReturnType<typeof filter>[];
  orderBy?: ReturnType<typeof orderBy>;
  limit?: ReturnType<typeof take>;
  before?: ReturnType<typeof before>;
  after?: ReturnType<typeof after>;
  // Points to the fully optimized hop expression
  // which can be hoisted
  hop?: SQLHopExpression<any, any>;
  // What we're actually selecting.
  // Could be IDs if we can't hoist the next hop and need to load them into the server for
  // the next hop. Could be based on what the caller asked for (count / ids / edges / models).
  what: 'model' | 'ids' | 'edges' | 'count';
};

export default abstract class SQLExpression<T> {
  constructor(protected ctx: Context, public readonly ops: HoistedOperations) {}

  protected hoist(plan: IPlan, nextHop?: HopPlan): [HoistedOperations, Expression[]] {
    const remainingExpressions: Expression[] = [];
    let { filters, orderBy, limit, hop, what, before, after } = this.ops;
    const writableFilters = filters ? [...filters] : [];

    for (let i = 0; i < plan.derivations.length; ++i) {
      const derivation = plan.derivations[i];
      switch (derivation.type) {
        case 'filter':
          if (!this.#optimizeFilter(derivation)) {
            remainingExpressions.push(derivation);
          } else {
            writableFilters.push(derivation);
          }
          break;
        case 'take':
          if (!this.#optimizeTake(derivation)) {
            remainingExpressions.push(derivation);
          } else {
            limit = derivation;
          }
          break;
        case 'before':
          if (!this.#optimizeBefore(derivation)) {
            remainingExpressions.push(derivation);
          } else {
            before = derivation;
          }
          break;
        case 'after':
          if (!this.#optimizeAfter(derivation)) {
            remainingExpressions.push(derivation);
          } else {
            after = derivation;
          }
          break;
        case 'orderBy':
          if (!this.#optimizeOrderBy(derivation)) {
            remainingExpressions.push(derivation);
          }
          break;
        case 'hop':
          // This can't happen... hop will be in `nextHop`
          // It can if they optimize twice and the hop was made a chain hop.
          throw new Error('Hops should be passed in as hop plans');
        default:
          remainingExpressions.push(derivation);
      }
    }

    if (nextHop) {
      const [hoistedHop, derivedExressions] = this.#optimizeHop(
        nextHop,
        remainingExpressions.length > 0,
      );
      for (const e of derivedExressions) {
        remainingExpressions.push(e);
      }
      hop = hoistedHop;
    }

    return [
      {
        filters: writableFilters,
        orderBy,
        limit,
        hop,
        what,
        before,
        after,
      },
      remainingExpressions,
    ];
  }

  #optimizeFilter(expression: ReturnType<typeof filter>): boolean {
    if (expression.getter instanceof ModelFieldGetter) {
      return true;
    }
    return false;
  }

  // TODO: implement these!
  #optimizeTake(expression: ReturnType<typeof take>): boolean {
    return false;
  }

  #optimizeBefore(expression: ReturnType<typeof before>): boolean {
    return false;
  }

  #optimizeAfter(expression: ReturnType<typeof after>): boolean {
    return false;
  }

  #optimizeOrderBy(expression: ReturnType<typeof orderBy>): boolean {
    return false;
  }

  #optimizeHop(
    hop: HopPlan,
    thisHasRemainingExpressions: boolean,
  ): [SQLHopExpression<any, any> | undefined, readonly Expression[]] {
    if (this.#canHoistHop(hop, thisHasRemainingExpressions)) {
      return [hop.hop as SQLHopExpression<any, any>, hop.derivations];
    }

    // can't hoist it. Just return everything as derived expressions.
    return [undefined, [hop.hop, ...hop.derivations]];
  }

  #canHoistHop(hop: HopPlan, thisHasRemainingExpressions: boolean): boolean {
    // If there are expressions that couldn't be rolled into source
    // then we can't roll the hop in too! We'd be hopping before
    // applying all expressions.
    // Nit: -- this isn't quite true...
    // we currently stick in a model load expression immediately when
    // creating a query.
    // We can drop the model load expression when we are hopping
    // because we obvisouly no longer want the model from
    // the first query.
    // Note: we could also just never stick in a model load expression
    // until calling `gen` or what have you.
    // ModelLoadExpression vs IDLoad vs EdgeLoad would determine our `what`
    // parameter which has thus far been indeterminate.
    if (thisHasRemainingExpressions) {
      return false;
    }

    // Check if the hop is:
    // 1. the same backend (e.g., SQL)
    // 2. on the same logical database
    // 3. has a corresponding backend operator (e.g., join) to perform the hop
    return false;
  }
}
