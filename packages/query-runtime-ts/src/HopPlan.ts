import { ChunkIterable } from './ChunkIterable.js';
import { Expression, HopExpression } from './Expression.js';
import { IPlan } from './Plan.js';

export default class HopPlan implements IPlan {
  constructor(
    private sourcePlan: IPlan,
    public readonly hop: HopExpression<any, any>,
    private derivs: Expression[],
  ) {}

  get derivations(): ReadonlyArray<Expression> {
    return this.derivs;
  }

  get iterable(): ChunkIterable<any> {
    const iterable = this.hop.chainAfter(this.sourcePlan.iterable);
    return this.derivs.reduce((iterable, expression) => expression.chainAfter(iterable), iterable);
  }

  addDerivation(expression?: Expression): this {
    if (!expression) {
      return this;
    }

    this.derivs.push(expression);

    return this;
  }

  /**
   * Queries are built up into a reverse linked list.
   * The last query is what the user executes.
   * This last query will optimize from the end back on down.
   */
  optimize(nextHop?: HopPlan): IPlan {
    // Optimize our hop and fold in the next hop
    const optimizedPlanForThisHop = this.hop.optimize(this.sourcePlan, this, nextHop);
    return this.sourcePlan.optimize(optimizedPlanForThisHop);
  }
}
