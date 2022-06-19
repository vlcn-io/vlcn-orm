import { Context } from '@aphro/context-runtime-ts';
import { invariant } from '@strut/utils';
import {
  count,
  EmptySourceExpression,
  Expression,
  HopExpression,
  SourceExpression,
} from './Expression.js';
import HopPlan from './HopPlan.js';
import LiveResult from './live/LiveResult.js';
import Plan, { IPlan } from './Plan.js';

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

  live(on: UpdateType): LiveResult<T>;

  // map<R>(fn: (t: T) => R): Query<R>;
  // flatMap<R>(fn: (t: T) => R[]): Query<R>;
  // filter(fn: (t: T) => boolean): Query<T>;
  // take(n: number): Query<T>;
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

  async gen(): Promise<T[]> {
    const plan = this.plan().optimize();

    let results: T[] = [];
    for await (const chunk of plan.iterable) {
      results = results.concat(chunk);
    }

    return results;
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

  count(): IterableDerivedQuery<number> {
    return new IterableDerivedQuery(this.ctx, this, count());
  }

  // map<R>(fn: (t: T) => R): Query<R> {
  //   return
  // }

  // filter(fn: (t: T) => boolean): Query<T> {

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
  #priorQuery: Query<TOut>;
  #expression?: Expression;

  constructor(ctx: Context, priorQuery: Query<any>, expression?: Expression) {
    super(ctx);
    this.#priorQuery = priorQuery;
    this.#expression = expression;
  }

  /**
   * This needs to match the constructor (sand priorQuery which is `this`) and serves the same purpose.
   * 1. TypeScript does not allow `ConsistentConstruct`
   * 2. TypeScript does not allow abstract static methods
   * 3. TypeScript does not allow `new self()` to instantiate
   *  a child class from a parent class. I.e., polymorphism on constructor.
   * but an instance method that matches the constructor and returns `this` does
   * the trick.
   *
   * `derive` is used for lambda filters
   */
  protected abstract derive(expression: Expression): ThisType<TOut>;

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

export class IterableDerivedQuery<TOut> extends DerivedQuery<TOut> {
  constructor(ctx: Context, priorQuery: Query<any>, expression: Expression) {
    super(ctx, priorQuery, expression);
  }

  protected derive<TNOut>(expression: Expression): ThisType<TNOut> {
    return new IterableDerivedQuery(this.ctx, this, expression);
  }
}

export class EmptyQuery extends SourceQuery<void> {
  constructor(ctx: Context) {
    super(ctx, new EmptySourceExpression());
  }
}
