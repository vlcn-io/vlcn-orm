import {
  after,
  before,
  Expression,
  filter,
  orderBy,
  SourceExpression,
  take,
} from '../Expression.js';
import SQLSourceChunkIterable from './SqlSourceChunkIterable.js';
import Plan from '../Plan.js';
import { ChunkIterable } from '../ChunkIterable.js';
import HopPlan from '../HopPlan.js';
import { ModelFieldGetter } from '../Field.js';
import { IModel, ModelSpec } from '@aphro/model-runtime-ts';
import SQLHopExpression from './SQLHopExpression.js';
import { Context } from '@aphro/context-runtime-ts';
import SQLExpression, { HoistedOperations } from './SQLExpression.js';
import { NodeSpec } from '@aphro/schema-api';

export interface SQLResult {}

export default class SQLSourceExpression<T extends IModel<Object>>
  extends SQLExpression<T>
  implements SourceExpression<T>
{
  constructor(
    ctx: Context,
    // we should take a schema instead of db
    // we'd need the schema to know if we can hoist certain fields or not
    public readonly spec: NodeSpec,
    ops: HoistedOperations,
  ) {
    super(ctx, ops);
  }

  optimize(plan: Plan, nextHop?: HopPlan): Plan {
    const [hoistedExpressions, remainingExpressions] = this.hoist(plan, nextHop);
    return new Plan(
      new SQLSourceExpression(this.ctx, this.spec, hoistedExpressions),
      remainingExpressions,
    );
  }

  get iterable(): ChunkIterable<T> {
    return new SQLSourceChunkIterable(this.ctx, this.spec, this.ops);
  }
}
