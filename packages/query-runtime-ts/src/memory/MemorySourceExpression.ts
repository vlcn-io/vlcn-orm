import { SourceExpression } from '../Expression.js';
import Plan from '../Plan.js';
import { ChunkIterable } from '../ChunkIterable.js';
import HopPlan from '../HopPlan.js';
import { specToDatasetKey } from '@aphro/model-runtime-ts';
import { Context, IModel, INode } from '@aphro/context-runtime-ts';
import { JunctionEdgeSpec, NodeSpec } from '@aphro/schema-api';
import MemorySourceChunkIterable from './MemorySourceChunkIterable.js';

export interface SQLResult {}

export type HoistedOperations = {
  what: 'model' | 'ids' | 'edges' | 'count';
  roots?: any[];
};
export default class MemorySourceExpression<T extends IModel<Object>>
  implements SourceExpression<T>
{
  constructor(
    public readonly ctx: Context,
    // we should take a schema instead of db
    // we'd need the schema to know if we can hoist certain fields or not
    public readonly spec: NodeSpec | JunctionEdgeSpec,
    private ops: HoistedOperations,
  ) {}

  optimize(plan: Plan, nextHop?: HopPlan): Plan {
    // TOOD: in-memory hoisting
    // we should iterate our expressions and see which ones can be hoisted
    // e.g., id filters.
    // We'd need to hoist roots. That's about it...
    // We could not even hoist and rely on later expressions
    // const [hoistedExpressions, remainingExpressions] = this.hoist(plan, nextHop);
    let derivs = [...plan.derivations];
    if (nextHop) {
      derivs.push(nextHop.hop);
      derivs = derivs.concat(nextHop.derivations);
    }
    return new Plan(new MemorySourceExpression(this.ctx, this.spec, this.ops), derivs);
    // return plan;
  }

  get iterable(): ChunkIterable<T> {
    return new MemorySourceChunkIterable(this.ctx, this.spec, {
      type: 'read',
      tablish: this.spec.storage.tablish,
      roots: this.ops.roots,
    });
  }

  implicatedDataset(): string {
    return specToDatasetKey(this.spec);
  }
}
