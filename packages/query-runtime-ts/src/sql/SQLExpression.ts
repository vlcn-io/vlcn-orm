import { Context } from '@aphro/context-runtime-ts';
import { NodeSpec } from '@aphro/schema-api';
import { ChunkIterable } from '../ChunkIterable';
import { SourceExpression } from '../Expression';
import HopPlan from '../HopPlan';
import Plan from '../Plan';

export default abstract class SQLExpression<T> implements SourceExpression<T> {
  constructor(private ctx: Context, private spec: NodeSpec) {}

  abstract readonly iterable: ChunkIterable<T>;
  abstract optimize(plan: Plan, nextHop?: HopPlan): Plan;
}
