import { ChunkIterable } from "./ChunkIterable.js";
import { Expression, HopExpression } from "./Expression.js";
import { IPlan } from "./Plan.js";

export default class HopPlan implements IPlan {
  #sourcePlan: IPlan;
  #derivations: Expression[];

  constructor(
    sourcePlan: IPlan,
    public readonly hop: HopExpression<any, any>,
    derivations: Expression[]
  ) {
    this.#derivations = derivations;
    this.#sourcePlan = sourcePlan;
  }

  get derivations(): ReadonlyArray<Expression> {
    return this.#derivations;
  }

  get iterable(): ChunkIterable<any> {
    const iterable = this.hop.chainAfter(this.#sourcePlan.iterable);
    return this.#derivations.reduce(
      (iterable, expression) => expression.chainAfter(iterable),
      iterable
    );
  }

  addDerivation(expression?: Expression): this {
    if (!expression) {
      return this;
    }

    this.#derivations.push(expression);

    return this;
  }

  /**
   * Queries are built up into a reverse linked list.
   * The last query is what the user executes.
   * This last query will optimize from the end back on down.
   */
  optimize(nextHop?: HopPlan): IPlan {
    // Optimize our hop and fold in the next hop
    const optimizedPlanForThisHop = this.hop.optimize(this, nextHop);
    return this.#sourcePlan.optimize(optimizedPlanForThisHop);
  }
}
