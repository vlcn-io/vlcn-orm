import { after, before, filter, hop, orderBy, SourceExpression, take } from '../Expression.js';
import Plan from '../Plan.js';
import { ChunkIterable } from '../ChunkIterable.js';
import HopPlan from '../HopPlan.js';
export declare type HoistedOperations = {
    filters?: readonly ReturnType<typeof filter>[];
    orderBy?: ReturnType<typeof orderBy>;
    limit?: ReturnType<typeof take>;
    before?: ReturnType<typeof before>;
    after?: ReturnType<typeof after>;
    hop?: ReturnType<typeof hop>;
    what: 'model' | 'ids' | 'edges' | 'count';
};
import { Spec } from '@aphro/model-runtime-ts';
export interface SQLResult {
}
export default class SQLSourceExpression<T> implements SourceExpression<T> {
    #private;
    private spec;
    private hoistedOperations;
    constructor(spec: Spec<T>, hoistedOperations: HoistedOperations);
    get iterable(): ChunkIterable<T>;
    optimize(plan: Plan, nextHop?: HopPlan): Plan;
}
