import {
  DerivedExpression,
  Expression,
  HopExpression,
  SourceExpression,
} from "./Expression.js";
import HopPlan from "./HopPlan.js";
import Plan, { IPlan } from "./Plan.js";

export interface Query<T> {
  plan(): IPlan;
  gen(): Promise<T[]>;
}

abstract class BaseQuery<T> implements Query<T> {
  async gen(): Promise<T[]> {
    const plan = this.plan().optimize();

    let results: T[] = [];
    for await (const chunk of plan.iterable) {
      results = results.concat(chunk);
    }

    return results;
  }

  abstract plan(): IPlan;
}

export abstract class SourceQuery<T> extends BaseQuery<T> {
  // source query
  // expression
  // make a recursive data structure of queries and expressions.
  // then convert to plan which will collapse expression as needed.
  // How do expressions convert themselves to SQL or whatever?
  constructor(public readonly expression: SourceExpression<T>) {
    super();
  }

  // Expression could be null if we're hopping an edge?
  // That'd just be a change in query type rather than an expression?
  // abstract new<TOut, Tq extends DerivedQuery<T, TOut>>(
  //   priorQuery: Query<T>,
  //   expression: Expression
  // ): Tq;

  plan() {
    return new Plan(this.expression, []);
  }
}

export abstract class HopQuery<TIn, TOut> extends BaseQuery<TOut> {
  #priorQuery: Query<TIn>;

  constructor(
    priorQuery: Query<TIn>,
    public readonly expression: HopExpression<TIn, TOut>
  ) {
    super();
    this.#priorQuery = priorQuery;
  }

  plan() {
    return new HopPlan(this.#priorQuery.plan(), this.expression, []);
  }
}

export abstract class DerivedQuery<TOut> extends BaseQuery<TOut> {
  #priorQuery: Query<TOut>;
  #expression?: Expression;

  constructor(priorQuery: Query<any>, expression?: Expression) {
    super();
    this.#priorQuery = priorQuery;
    this.#expression = expression;
  }

  plan() {
    const plan = this.#priorQuery.plan();
    if (this.#expression) {
      plan.addDerivation(this.#expression);
    }

    return plan;
  }
}

/*
Derived query example:
SlideQuery extends DerivedQuery {
  static create() {
    return new SlideQuery(
      Factory.createSourceQueryFor(schema) // e.g., new SQLSourceQuery(),
      // convert raw db result into model load.
      // we'd want to move this expression to the end in plan optimizaiton.
      new ModelLoadExpression(schema),
    );
  }

  whereName(predicate: Predicate) {
    return new SlideQuery(
      this, // the prior query
      new ModelFilterExpression(field, predicate)
    );
  }
}
*/
