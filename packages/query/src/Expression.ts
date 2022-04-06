// If you make this a module you can allow other files to extend the type

import Plan, { IPlan } from "./Plan.js";
import {
  ChunkIterable,
  FilteredChunkIterable,
  TakeChunkIterable,
} from "./ChunkIterable.js";
import { Predicate } from "./Predicate.js";
import { FieldGetter } from "./Field.js";
import HopPlan from "./HopPlan.js";
import ModelLoadExpression from "./ModelLoadExpression.js";
import Model, { IModel } from "Model.js";

export type ExpressionType =
  | "take"
  | "before"
  | "after"
  | "filter"
  | "orderBy"
  | "hop"
  | "modelLoad";
export type Direction = "asc" | "dec";
export type Expression =
  | ReturnType<typeof take>
  | ReturnType<typeof before>
  | ReturnType<typeof after>
  | ReturnType<typeof filter>
  | ReturnType<typeof orderBy>
  | ReturnType<typeof hop>
  | ReturnType<typeof modelLoad>;
/*
declare module '@mono/model/query' {
  interface Expressions<ReturnType> {
    expr: () => ReturnType;
  }
}

export type Expression = // union of the mapping of return types of the members of the interface??
// maybe something like: https://github.com/ueberdosis/tiptap/blob/main/packages/core/src/types.ts#L197
*/

export function take<T>(num: number): {
  type: "take";
  num: number;
} & DerivedExpression<T, T> {
  return {
    type: "take",
    num,
    chainAfter(iterable) {
      return new TakeChunkIterable(iterable, num);
    },
  };
}

export function before<T>(
  cursor: string
): { type: "before"; cursor: string } & DerivedExpression<T, T> {
  return {
    type: "before",
    cursor,
    chainAfter(_) {
      throw new Error("Cursor must be consumed in plan optimization");
    },
  };
}

export function after<T>(
  cursor: string
): { type: "after"; cursor: string } & DerivedExpression<T, T> {
  return {
    type: "after",
    cursor,
    chainAfter(_) {
      throw new Error("Cursor must be consumed in plan optimization");
    },
  };
}

// Needs to be more robust as we need to know if field and value are hoistable to the backend.
// So this should be some spec that references the schema in some way.
export function filter<Tm, Tv>(
  getter: FieldGetter<Tm, Tv>,
  predicate: Predicate<Tv>
): {
  type: "filter";
  getter: FieldGetter<Tm, Tv>;
  predicate: Predicate<Tv>;
} & DerivedExpression<Tm, Tm> {
  return {
    type: "filter",
    getter,
    predicate,
    chainAfter(iterable) {
      return new FilteredChunkIterable(iterable, async (m) =>
        predicate.call(getter.get(m))
      );
    },
  };
}

export function orderBy<Tm, Tv>(
  getter: FieldGetter<Tm, Tv>,
  direction: Direction
): { type: "orderBy" } & DerivedExpression<Tm, Tm> {
  throw new Error();
}

// put in the edge?
export function hop<TIn, TOut>(): HopExpression<TIn, TOut> {
  // hops have _kinds_
  // like SQL hops
  // or Cypher hops
  // We'd have to determine this by taking in the edge information from
  // the schema.
  throw new Error();
}

export function modelLoad<TData, TModel extends IModel<TData>>(
  factory: (TData) => TModel
): ModelLoadExpression<TData, TModel> {
  return new ModelLoadExpression(factory);
}

/*
  junction edge
  foreign key
  all require a getter on the source.
  and a getter on the dest.
  and the schema of the dest
  */
// Should have a field getter that
// 1. Has the db field
// 2. has the method if can't hoist
// Should have a predicate class
// That we can determine if hoistable or not

export interface SourceExpression<TOut> {
  readonly iterable: ChunkIterable<TOut>;
  optimize(plan: Plan, nextHop?: HopPlan): Plan;
}

export interface DerivedExpression<TIn, TOut> {
  chainAfter(iterable: ChunkIterable<TIn>): ChunkIterable<TOut>;
  type: ExpressionType;
}

export interface HopExpression<TIn, TOut> {
  chainAfter(iterable: ChunkIterable<TIn>): ChunkIterable<TOut>;
  /**
   * Optimizes the current plan (plan) and folds in the nxet hop (nextHop) if possible.
   */
  optimize(plan: HopPlan, nextHop?: HopPlan): HopPlan;
  type: "hop";
}
