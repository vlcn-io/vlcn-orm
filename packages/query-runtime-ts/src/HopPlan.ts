import { ChunkIterable } from './ChunkIterable.js';
import { Expression, HopExpression } from './Expression.js';
import { IPlan } from './Plan.js';

/**
 * Hop plans hold all expressions that should be executed _after_ traversing a given
 * hop (edge) but before traversing the next hop (edge).
 *
 * E.g., A --> B --> C
 *
 * A HopPlan exists from A --> B and another from B --> C.
 *
 * The first hop plan encodes any derived expressions that occur against the data
 * loaded by the A --> B hop.
 *
 * The second hop plan encodes any derived expressions that occur against the data
 * loaded by the B --> C hop.
 *
 * See more on query planning here:
 * https://tantaman.com/2022-05-26-query-planning
 */
export default class HopPlan implements IPlan {
  constructor(
    public readonly sourcePlan: IPlan,
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

  async gen(): Promise<any[]> {
    let results: any[] = [];
    for await (const chunk of this.iterable) {
      results = results.concat(chunk);
    }

    return results;
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
