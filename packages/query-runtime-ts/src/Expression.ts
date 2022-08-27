/**
 * There are three kinds of expressions:
 * 1. Source expressions
 * 2. Derived expressions
 * 3. Hop expressions
 *
 * which are further subdivided into more kinds of expressions.
 *
 * Source expressions are used to load data from a data source. E.g., `SQLSourceExpression` loads
 * data from a SQL database.
 *
 * Derived expressions transform data returned by source or hop expressions.
 * In other words, derived expressions apply filters/limits/orderings/other arbitrary logic
 *
 * Hop expressions are source expressions that take a parameter. They represent
 * hops from one data source to another or from one table to another. E.g.,
 * joins or edge traversals.
 *
 * You can get some more context here:
 * https://tantaman.com/2022-05-26-query-builder.html
 */

import Plan, { IPlan } from './Plan.js';
import { ChunkIterable, StaticSourceChunkIterable, TakeChunkIterable } from './ChunkIterable.js';
import P, { Predicate } from './Predicate.js';
import { FieldGetter } from './Field.js';
import HopPlan from './HopPlan.js';
import ModelLoadExpression from './ModelLoadExpression.js';
import { Context, IModel } from '@aphro/context-runtime-ts';
import CountLoadExpression from './CountLoadExpression.js';
import { Query } from './Query.js';

export type ExpressionType =
  | 'take'
  | 'before'
  | 'after'
  | 'filter'
  | 'filterAsync'
  | 'orderBy'
  | 'orderByLambda'
  | 'hop'
  | 'modelLoad'
  | 'count'
  | 'countLoad'
  | 'map'
  | 'mapAsync'
  | 'union';

export type Direction = 'asc' | 'desc';
export type Expression =
  | ReturnType<typeof take<any>>
  | ReturnType<typeof before<any>>
  | ReturnType<typeof after<any>>
  | ReturnType<typeof filter<any, any>>
  | ReturnType<typeof filterAsync<any, any>>
  | ReturnType<typeof orderBy<any, any>>
  | ReturnType<typeof orderByLambda<any>>
  | ReturnType<typeof hop<any, any>>
  | ReturnType<typeof modelLoad<any, any>>
  | ReturnType<typeof count<any>>
  | CountLoadExpression<any>
  | ReturnType<typeof map<any, any>>
  | ReturnType<typeof mapAsync<any, any>>
  | ReturnType<typeof union<any>>;
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
  type: 'take';
  num: number;
} & DerivedExpression<T, T> {
  return {
    type: 'take',
    num,
    chainAfter(iterable) {
      return new TakeChunkIterable(iterable, num);
    },
  };
}

export function before<T>(
  cursor: string,
): { type: 'before'; cursor: string } & DerivedExpression<T, T> {
  return {
    type: 'before',
    cursor,
    chainAfter(_) {
      throw new Error('Cursor must be consumed in plan optimization');
    },
  };
}

export function after<T>(
  cursor: string,
): { type: 'after'; cursor: string } & DerivedExpression<T, T> {
  return {
    type: 'after',
    cursor,
    chainAfter(_) {
      throw new Error('Cursor must be consumed in plan optimization');
    },
  };
}

// Needs to be more robust as we need to know if field and value are hoistable to the backend.
// So this should be some spec that references the schema in some way.
export function filter<Tm, Tv>(
  getter: FieldGetter<Tm, Tv> | null,
  predicate: Predicate<Tv>,
): {
  type: 'filter';
  getter: FieldGetter<Tm, Tv> | null;
  predicate: Predicate<Tv>;
} & DerivedExpression<Tm, Tm> {
  return {
    type: 'filter',
    getter,
    predicate,
    chainAfter(iterable) {
      // TODO:
      // @ts-ignore
      return iterable.filter(m => predicate.call(getter == null ? m : getter.get(m)));
    },
  };
}

export function exists() {}

export function filterAsync<Tm, Tv>(
  getter: FieldGetter<Tm, Tv> | null,
  predicate: Predicate<Tv>,
): {
  type: 'filterAsync';
  getter: FieldGetter<Tm, Tv> | null;
  predicate: Predicate<Tv>;
} & DerivedExpression<Tm, Tm> {
  return {
    type: 'filterAsync',
    getter,
    predicate,
    chainAfter(iterable) {
      // TODO:
      // @ts-ignore
      return iterable.filterAsync(m => predicate.call(getter == null ? m : getter.get(m)));
    },
  };
}

export function map<T, R>(fn: (f: T) => R): { type: 'map' } & DerivedExpression<T, R> {
  return {
    type: 'map',
    chainAfter(iterable) {
      return iterable.map(fn);
    },
  };
}

export function mapAsync<T, R>(
  fn: (f: T) => Promise<R>,
): { type: 'mapAsync' } & DerivedExpression<T, R> {
  return {
    type: 'mapAsync',
    chainAfter(iterable) {
      return iterable.mapAsync(fn);
    },
  };
}

export function orderBy<Tm, Tv>(
  getter: FieldGetter<Tm, Tv>,
  direction: Direction,
): { type: 'orderBy'; getter: FieldGetter<Tm, Tv>; direction: Direction } & DerivedExpression<
  Tm,
  Tm
> {
  return {
    type: 'orderBy',
    getter,
    direction,
    chainAfter(iterable) {
      return iterable.orderBy((leftModel: Tm, rightModel: Tm) => {
        const leftValue = getter.get(leftModel);
        const rightValue = getter.get(rightModel);

        if (leftValue == rightValue) {
          return 0;
        }

        if (leftValue > rightValue) {
          return direction === 'asc' ? 1 : -1;
        }
        return direction === 'asc' ? -1 : 1;
      });
    },
  };
}

export function orderByLambda<Tm>(fn: (l: Tm, r: Tm) => number): {
  type: 'orderByLambda';
} & DerivedExpression<Tm, Tm> {
  return {
    type: 'orderByLambda',
    chainAfter(iterable) {
      return iterable.orderBy(fn);
    },
  };
}

export function count<Tm>(): { type: 'count' } & DerivedExpression<Tm, number> {
  return {
    type: 'count',
    chainAfter(iterable) {
      return iterable.count();
    },
  };
}

export function hop<TIn, TOut>(): HopExpression<TIn, TOut> {
  throw new Error();
}

export function modelLoad<TData extends {}, TModel extends IModel<TData>>(
  ctx: Context,
  factory: (ctx: Context, data: TData) => TModel,
): ModelLoadExpression<TData, TModel> {
  return new ModelLoadExpression(ctx, factory);
}

export function union<TOut>(
  q: Query<TOut>,
): { type: 'union'; query: Query<TOut> } & DerivedExpression<TOut, TOut> {
  return {
    type: 'union',
    query: q,
    chainAfter(iterable) {
      const otherIterable = q.plan().optimize().iterable;
      return iterable.union(otherIterable);
    },
  };
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
  implicatedDataset(): string;
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
  optimize(sourcePlan: IPlan, plan: HopPlan, nextHop?: HopPlan): HopPlan;
  implicatedDataset(): string;
  type: 'hop';
}

export class EmptySourceExpression implements SourceExpression<void> {
  optimize(plan: Plan, nextHop?: HopPlan): Plan {
    return new Plan(new EmptySourceExpression(), []);
  }

  implicatedDataset(): string {
    return '';
  }

  get iterable(): ChunkIterable<void> {
    return new StaticSourceChunkIterable([]);
  }
}
