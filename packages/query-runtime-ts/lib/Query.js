import HopPlan from "./HopPlan.js";
import Plan from "./Plan.js";
class BaseQuery {
    async gen() {
        const plan = this.plan().optimize();
        let results = [];
        for await (const chunk of plan.iterable) {
            results = results.concat(chunk);
        }
        return results;
    }
}
export class SourceQuery extends BaseQuery {
    expression;
    // source query
    // expression
    // make a recursive data structure of queries and expressions.
    // then convert to plan which will collapse expression as needed.
    // How do expressions convert themselves to SQL or whatever?
    constructor(expression) {
        super();
        this.expression = expression;
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
export class HopQuery extends BaseQuery {
    expression;
    #priorQuery;
    constructor(priorQuery, expression) {
        super();
        this.expression = expression;
        this.#priorQuery = priorQuery;
    }
    plan() {
        return new HopPlan(this.#priorQuery.plan(), this.expression, []);
    }
}
export class DerivedQuery extends BaseQuery {
    #priorQuery;
    #expression;
    constructor(priorQuery, expression) {
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
//# sourceMappingURL=Query.js.map