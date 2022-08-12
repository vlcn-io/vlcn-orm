import { Context } from '@aphro/context-runtime-ts';
import HopPlan from '../HopPlan.js';
import Plan, { IPlan } from '../Plan.js';
import { after, before, Expression, filter, orderBy, take, union } from '../Expression.js';
import SQLHopExpression from './SQLHopExpression.js';
import { ModelFieldGetter } from '../Field.js';
import CountLoadExpression from '../CountLoadExpression.js';
import { getLastSpecAndProjection } from './specAndOpsToQuery.js';
import { JunctionEdgeSpec, NodeSpec } from '@aphro/schema-api';

export type HoistedOperations = {
  filters?: readonly ReturnType<typeof filter<any, any>>[];
  unions?: readonly ReturnType<typeof union>[];
  orderBy?: ReturnType<typeof orderBy<any, any>>;
  limit?: ReturnType<typeof take<any>>;
  before?: ReturnType<typeof before<any>>;
  after?: ReturnType<typeof after<any>>;
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
    let remainingExpressions: Expression[] = [];
    let { filters, orderBy, limit, hop, what, before, after, unions } = this.ops;
    const writableFilters = filters ? [...filters] : [];
    const writableUnions = unions ? [...unions] : [];

    for (let i = 0; i < plan.derivations.length; ++i) {
      const derivation = plan.derivations[i];
      switch (derivation.type) {
        case 'filter':
          if (!this.#canHoistFilter(derivation)) {
            remainingExpressions.push(derivation);
          } else {
            writableFilters.push(derivation);
          }
          break;
        case 'take':
          if (!this.#canHoistTake(derivation)) {
            remainingExpressions.push(derivation);
          } else {
            limit = derivation;
          }
          break;
        case 'before':
          if (!this.#canHoistBefore(derivation)) {
            remainingExpressions.push(derivation);
          } else {
            before = derivation;
          }
          break;
        case 'after':
          if (!this.#canHoistAfter(derivation)) {
            remainingExpressions.push(derivation);
          } else {
            after = derivation;
          }
          break;
        case 'orderBy':
          if (!this.#canHoistOrderBy(derivation)) {
            remainingExpressions.push(derivation);
          } else {
            orderBy = derivation;
          }
          break;
        case 'hop':
          // This can't happen... hop will be in `nextHop`
          // It can if they optimize twice and the hop was made a chain hop.
          throw new Error('Hops should be passed in as hop plans');
        case 'count':
          // Strip model load. Since we're counting we're not loading.
          remainingExpressions = remainingExpressions.filter(e => e.type !== 'modelLoad');
          if (!this.#canHoistCount(remainingExpressions)) {
            remainingExpressions.push(derivation);
          } else {
            what = 'count';
            remainingExpressions.push(new CountLoadExpression(this.ctx));
          }
          break;
        case 'union':
          // we should probably do re-ordering before figuring out the hoisting of a union.
          // union is a distinct query that we only know if we can hoist after we've optimized
          // the current query.
          if (!this.#canHoistUnion(derivation)) {
            remainingExpressions.push(derivation);
          } else {
            writableUnions.push(derivation);
          }
          break;
        default:
          remainingExpressions.push(derivation);
      }
    }

    if (nextHop) {
      const [hoistedHop, derivedExressions] = this.#hoistHop(nextHop, remainingExpressions);
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

  #canHoistFilter(expression: ReturnType<typeof filter>): boolean {
    if (expression.getter instanceof ModelFieldGetter) {
      return true;
    }
    return false;
  }

  #canHoistUnion(
    expression: ReturnType<typeof union>,
    // lastSpec: NodeSpec | JunctionEdgeSpec,
    // lastWhat: HoistedOperations['what'],
  ): boolean {
    const otherOptimizedPlan = expression.query.plan().optimize();
    if (!(otherOptimizedPlan instanceof Plan)) {
      return false;
    }
    const otherSource = otherOptimizedPlan.source;
    if (!(otherSource instanceof SQLExpression)) {
      return false;
    }

    // We need access to the current query's complete optimization
    // so we can check that lastSpec and lastWhat match.
    // We also need to understand if `other` is fully optimized or not.
    // If it is partially optimized..... do we union anyway and apply
    // filters later? Or fully discard the union and do it all in-memory?
    // const [otherLastSpec, otherLastWhat] = getLastSpecAndProjection(
    //   otherSource.spec,
    //   otherSource.ops,
    // );

    // well... the query must:
    // 1. hit the same engine
    // 2. hit the same db
    // 3. end at the same tablish
    // (3) can be guaranteed by our type system? no.
    // we must end optimizably at the same tablish.
    // and the projections (count vs model vs id) must match.
    // so we need the optimized plan of the query we're unioning against.
    return false;
  }

  // TODO: implement these!
  #canHoistTake(expression: ReturnType<typeof take>): boolean {
    return true;
  }

  #canHoistBefore(expression: ReturnType<typeof before>): boolean {
    return false;
  }

  #canHoistAfter(expression: ReturnType<typeof after>): boolean {
    return false;
  }

  #canHoistOrderBy(expression: ReturnType<typeof orderBy>): boolean {
    if (expression.getter instanceof ModelFieldGetter) {
      return true;
    }

    return false;
  }

  #hoistHop(
    hop: HopPlan,
    myRemainingExpressions: Expression[],
  ): [SQLHopExpression<any, any> | undefined, readonly Expression[]] {
    const remainingExpressionsWithoutModelLoad = myRemainingExpressions.filter(
      e => e.type !== 'modelLoad',
    );

    // Technically ModelLoadExpressions are always inserted even if we don't need them...
    // Should we throw them out when queries are chained?
    // Well.. we still need them because if we can't optimize we need to load the model
    // for in-memory chaning and filtering.
    if (this.#canHoistHop(hop, remainingExpressionsWithoutModelLoad)) {
      const modelLoadIndex = myRemainingExpressions.findIndex(e => e.type === 'modelLoad');
      // Since we're hopping there's no need to load the model of the currente expression.
      // until we get to solving 1+N.
      myRemainingExpressions.splice(modelLoadIndex, 1);
      return [hop.hop as SQLHopExpression<any, any>, hop.derivations];
    }

    // can't hoist it. Just return everything as derived expressions.
    return [undefined, [hop.hop, ...hop.derivations]];
  }

  #canHoistHop(hop: HopPlan, filteredRaminingExpressions: readonly Expression[]): boolean {
    if (filteredRaminingExpressions.length > 0) {
      return false;
    }

    // TODO Check if the hop is:
    // 1. the same backend (e.g., SQL)
    // 2. on the same logical database
    // 3. has a corresponding backend operator (e.g., join) to perform the hop
    return true;
  }

  #canHoistCount(remainingExpressions: Expression[]) {
    return remainingExpressions.length === 0;
  }
}
