import { Context } from '@aphro/context-runtime-ts';
import { invariant } from '@strut/utils';
import {
  count,
  EmptySourceExpression,
  Expression,
  filter,
  filterAsync,
  HopExpression,
  map,
  mapAsync,
  orderBy,
  orderByLambda,
  SourceExpression,
  union,
} from './Expression.js';
import HopPlan from './HopPlan.js';
import LiveResult from './live/LiveResult.js';
import Plan, { IPlan } from './Plan.js';
import P from './Predicate.js';
import tracer from './trace.js';

export enum UpdateType {
  CREATE = 1,
  UPDATE = 2,
  CREATE_OR_UPDATE = UpdateType.CREATE | UpdateType.UPDATE,
  DELETE = 4,
  CREATE_OR_DELETE = UpdateType.CREATE | UpdateType.DELETE,
  DELETE_OR_UPDATE = UpdateType.DELETE | UpdateType.UPDATE,
  ANY = UpdateType.CREATE | UpdateType.UPDATE | UpdateType.DELETE,
}

/**
 * See https://tantaman.com/2022-05-26-query-builder for more details
 * on query building.
 */
export interface Query<T> {
  gen(): Promise<T[]>;
  genOnlyValue(): Promise<T | null>;
  genxOnlyValue(): Promise<T>;

  /**
   * Returns a live result that is updated whenever the data that matches the backing query changes.
   * @param on
   */
  live(on: UpdateType): LiveResult<T>;

  /**
   * Same as `live` except that it allows you to await a prefetch.
   *
   * Use this if you want to prefetch initial data and then subscribe to updates.
   *
   * @param on
   */
  genLive(on: UpdateType): Promise<LiveResult<T>>;

  // flatMap<R>(fn: (t: T) => R[]): Query<R>;
  // after(cursor: Cursor<T>): Query<T>
  count(): IterableDerivedQuery<number>;

  plan(): IPlan;
  implicatedDatasets(): Set<string>;
}

abstract class BaseQuery<T> implements Query<T> {
  protected readonly ctx: Context;
  constructor(ctx: Context) {
    this.ctx = ctx;
  }

  gen(): Promise<T[]> {
    return tracer.genStartActiveSpan(this.constructor.name + '.gen', span => {
      return this.plan().optimize().gen();
    });
  }

  async genOnlyValue(): Promise<T | null> {
    const values = await this.gen();
    invariant(values.length <= 1, 'genOnlyValue returned more values than expected.');

    return values[0] || null;
  }

  async genxOnlyValue(): Promise<T> {
    const ret = await this.genOnlyValue();
    if (ret == null) {
      throw new Error('genxOnlyValue did not return a value');
    }

    return ret;
  }

  live(on: UpdateType): LiveResult<T> {
    return new LiveResult(this.ctx, on, this);
  }

  async genLive(on: UpdateType = UpdateType.ANY): Promise<LiveResult<T>> {
    const ret = new LiveResult(this.ctx, on, this);
    await ret.__currentHandle;
    return ret;
  }

  count(): IterableDerivedQuery<number> {
    return new IterableDerivedQuery(this.ctx, this, count());
  }

  // map<R>(fn: (t: T) => R): Query<R> {
  //   return
  // }

  abstract plan(): IPlan;
  abstract implicatedDatasets(): Set<string>;
}

export abstract class SourceQuery<T> extends BaseQuery<T> {
  // source query
  // expression
  // make a recursive data structure of queries and expressions.
  // then convert to plan which will collapse expression as needed.
  // How do expressions convert themselves to SQL or whatever?
  constructor(ctx: Context, public readonly expression: SourceExpression<T>) {
    super(ctx);
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

  implicatedDatasets(): Set<string> {
    return new Set([this.expression.implicatedDataset()]);
  }
}

export abstract class HopQuery<TIn, TOut> extends BaseQuery<TOut> {
  constructor(
    ctx: Context,
    private priorQuery: Query<TIn>,
    public readonly expression: HopExpression<TIn, TOut>,
  ) {
    super(ctx);
  }

  plan() {
    return new HopPlan(this.priorQuery.plan(), this.expression, []);
  }

  implicatedDatasets(): Set<string> {
    const s = this.priorQuery.implicatedDatasets();
    s.add(this.expression.implicatedDataset());
    return s;
  }
}

export abstract class DerivedQuery<TOut> extends BaseQuery<TOut> {
  #priorQuery: Query<any>;
  #expression?: Expression;

  constructor(ctx: Context, priorQuery: Query<any>, expression?: Expression) {
    super(ctx);
    this.#priorQuery = priorQuery;
    this.#expression = expression;
  }

  /**
   * This needs to match the constructor (sans priorQuery which is `this`) and serves the same purpose.
   * 1. TypeScript does not allow `ConsistentConstruct`
   * 2. TypeScript does not allow abstract static methods
   * 3. TypeScript does not allow `new self()` to instantiate
   *  a child class from a parent class. I.e., polymorphism on constructor.
   * but an instance method that matches the constructor and returns `this` does
   * the trick.
   *
   * `derive` is used for lambda filters
   */
  protected abstract derive(expression: Expression): any;

  /**
   * Be careful when using lambdas to filter/map/order.
   * Lambdas can't be run in the database and requires pulling all matched
   * records by the query into the application to perform filtering.
   * @param fn
   * @returns
   */
  where(fn: (t: TOut) => boolean): this {
    return this.derive(filter<TOut, TOut>(null, P.lambda(fn)));
  }

  whereAsync(fn: (t: TOut) => Promise<boolean>): this {
    return this.derive(filterAsync<TOut, TOut>(null, P.asyncLambda(fn)));
  }

  map<TMapped>(fn: (t: TOut) => TMapped): DerivedQuery<TMapped> {
    return this.derive(map(fn));
  }

  mapAsync<TMapped>(fn: (t: TOut) => Promise<TMapped>): DerivedQuery<TMapped> {
    return this.derive(mapAsync(fn));
  }

  orderBy(fn: (l: TOut, r: TOut) => number): this {
    return this.derive(orderByLambda(fn));
  }

  union(other: this): this {
    return this.derive(union<TOut>(other));
  }
  // intersect, concat, etc.

  plan() {
    const plan = this.#priorQuery.plan();
    if (this.#expression) {
      plan.addDerivation(this.#expression);
    }

    return plan;
  }

  implicatedDatasets(): Set<string> {
    return this.#priorQuery.implicatedDatasets();
  }
}

export class IterableDerivedQuery<TOut> extends DerivedQuery<TOut> {
  constructor(ctx: Context, priorQuery: Query<any>, expression: Expression) {
    super(ctx, priorQuery, expression);
  }

  protected derive<TNOut>(expression: Expression): IterableDerivedQuery<TNOut> {
    return new IterableDerivedQuery(this.ctx, this, expression);
  }
}

// and regular old IterableQuery to allow making anything
// into a query

export class EmptyQuery extends SourceQuery<void> {
  constructor(ctx: Context) {
    super(ctx, new EmptySourceExpression());
  }
}
