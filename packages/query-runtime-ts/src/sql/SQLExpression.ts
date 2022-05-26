import { Context } from '@aphro/context-runtime-ts';
import { NodeSpec } from '@aphro/schema-api';
import { ChunkIterable } from '../ChunkIterable';
import HopPlan from '../HopPlan';
import Plan from '../Plan';
import { after, before, filter, orderBy, SourceExpression, take } from '../Expression.js';
import SQLHopExpression from './SQLHopExpression';

export type HoistedOperations = {
  filters?: readonly ReturnType<typeof filter>[];
  orderBy?: ReturnType<typeof orderBy>;
  limit?: ReturnType<typeof take>;
  before?: ReturnType<typeof before>;
  after?: ReturnType<typeof after>;
  // Points to the fully optimized hop expression
  // which can be hoisted
  hop?: SQLHopExpression<any, any>;
  // What we're actually selecting.
  // Could be IDs if we can't hoist the next hop and need to load them into the server for
  // the next hop. Could be based on what the caller asked for (count / ids / edges / models).
  what: 'model' | 'ids' | 'edges' | 'count';
};

export default abstract class SQLExpression<T> implements SourceExpression<T> {
  constructor(private ctx: Context, private spec: NodeSpec) {}

  abstract readonly iterable: ChunkIterable<T>;
  abstract optimize(plan: Plan, nextHop?: HopPlan): Plan;
}
