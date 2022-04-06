import { ChunkIterable } from "./ChunkIterable.js";
import { Expression, SourceExpression } from "./Expression.js";
import HopPlan from "./HopPlan.js";

export interface IPlan {
  get derivations(): readonly Expression[];
  get iterable(): ChunkIterable<any>;
  addDerivation(expression?: Expression): this;
  optimize(nextHop?: HopPlan): IPlan;
}

export default class Plan implements IPlan {
  #source: SourceExpression<any>;
  // pairwise TIn and TOuts should match
  #derivations: Expression[];

  constructor(source: SourceExpression<any>, derivations: Expression[]) {
    this.#source = source;
    this.#derivations = derivations;
  }

  get derivations(): ReadonlyArray<Expression> {
    return this.#derivations;
  }

  get iterable(): ChunkIterable<any> /* final TOut */ {
    const iterable = this.#source.iterable;
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

  optimize(nextHop?: HopPlan) {
    return this.#source.optimize(this, nextHop);
  }

  // partition(): [Plan, ...HopPlan] {
  //   const sourcePlan =
  // }
}
