import {
  after,
  before,
  DerivedExpression,
  Expression,
  filter,
  hop,
  HopExpression,
  orderBy,
  SourceExpression,
  take,
} from "../Expression.js";
import SQLSourceChunkIterable from "./SqlSourceChunkIterable.js";
import Plan from "../Plan.js";
import { ChunkIterable } from "../ChunkIterable.js";
import HopPlan from "../HopPlan.js";
export type HoistedOperations = {
  filters?: readonly ReturnType<typeof filter>[];
  orderBy?: ReturnType<typeof orderBy>;
  limit?: ReturnType<typeof take>;
  before?: ReturnType<typeof before>;
  after?: ReturnType<typeof after>;
  // Points to the fully optimized hop expression
  // which can be hoisted
  hop?: ReturnType<typeof hop>;
  // What we're actually selecting.
  // Could be IDs if we can't hoist the next hop and need to load them into the server for
  // the next hop. Could be based on what the caller asked for (count / ids / edges / models).
  what: "model" | "ids" | "edges" | "count";
};
import { ModelFieldGetter } from "../Field.js";
import { Spec } from "../../Model.js";

export interface SQLResult {}

export default class SQLSourceExpression<T> implements SourceExpression<T> {
  constructor(
    // we should take a schema instead of db
    // we'd need the schema to know if we can hoist certain fields or not
    private spec: Spec<T>,
    private hoistedOperations: HoistedOperations
  ) {}

  get iterable(): ChunkIterable<T> {
    return new SQLSourceChunkIterable(this.spec, this.hoistedOperations);
  }

  optimize(plan: Plan, nextHop?: HopPlan): Plan {
    const remainingExpressions: Expression[] = [];
    let { filters, orderBy, limit, hop, what, before, after } =
      this.hoistedOperations;
    const writableFilters = filters ? [...filters] : [];

    for (let i = 0; i < plan.derivations.length; ++i) {
      const derivation = plan.derivations[i];
      switch (derivation.type) {
        case "filter":
          if (!this.#optimizeFilter(derivation)) {
            remainingExpressions.push(derivation);
          } else {
            writableFilters.push(derivation);
          }
          break;
        case "take":
          if (!this.#optimizeTake(derivation)) {
            remainingExpressions.push(derivation);
          } else {
            limit = derivation;
          }
          break;
        case "before":
          if (!this.#optimizeBefore(derivation)) {
            remainingExpressions.push(derivation);
          } else {
            before = derivation;
          }
          break;
        case "after":
          if (!this.#optimizeAfter(derivation)) {
            remainingExpressions.push(derivation);
          } else {
            after = derivation;
          }
          break;
        case "orderBy":
          if (!this.#optimizeOrderBy(derivation)) {
            remainingExpressions.push(derivation);
          }
          break;
        case "hop":
          // This can't happen... hop will be in `nextHop`
          throw new Error("Hops should be passed in as hop plans");
        default:
          remainingExpressions.push(derivation);
      }
    }

    if (nextHop) {
      const [hoistedHop, derivedExressions] = this.#optimizeHop(
        nextHop,
        remainingExpressions.length > 0
      );
      for (const e of derivedExressions) {
        remainingExpressions.push(e);
      }
      hop = hoistedHop;
    }

    return new Plan(
      new SQLSourceExpression(this.spec, {
        filters,
        orderBy,
        limit,
        hop,
        what,
        before,
        after,
      }),
      remainingExpressions
    );
  }

  #optimizeFilter(expression: ReturnType<typeof filter>): boolean {
    if (expression.getter instanceof ModelFieldGetter) {
      return true;
    }
    return false;
  }

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
    thisHasRemainingExpressions: boolean
  ): [HopExpression<any, any> | undefined, readonly Expression[]] {
    if (this.#canHoistHop(hop, thisHasRemainingExpressions)) {
      return [hop.hop, hop.derivations];
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
