import { ChunkIterable } from './ChunkIterable.js';
import { Expression, SourceExpression } from './Expression.js';
import HopPlan from './HopPlan.js';

/**
 * Interface for a query plan! What is a query plan? Why
 * does an ORM need a query plan given its just going to generate
 * SQL at the end?
 *
 * Good questions. See https://tantaman.com/2022-05-26-query-planning
 */
export interface IPlan {
  get derivations(): readonly Expression[];
  get iterable(): ChunkIterable<any>;
  addDerivation(expression?: Expression): this;
  optimize(nextHop?: HopPlan): IPlan;
  gen(): Promise<any[]>;
}

export default class Plan implements IPlan {
  constructor(
    public readonly source: SourceExpression<any>,
    public readonly derivations: Expression[],
  ) {}

  get iterable(): ChunkIterable<any> /* final TOut */ {
    const iterable = this.source.iterable;
    return this.derivations.reduce(
      (iterable, expression) => expression.chainAfter(iterable),
      iterable,
    );
  }

  async gen(): Promise<any[]> /* final TOut[] */ {
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

    this.derivations.push(expression);

    return this;
  }

  optimize(nextHop?: HopPlan) {
    return this.source.optimize(this, nextHop);
  }

  // partition(): [Plan, ...HopPlan] {
  //   const sourcePlan =
  // }
}
