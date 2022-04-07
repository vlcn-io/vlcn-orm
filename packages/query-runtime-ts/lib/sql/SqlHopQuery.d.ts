import { HopQuery, Query } from '../Query.js';
import { ModelSpec } from '@aphro/model-runtime-ts';
export default class SQLHopQuery<TIn, TOut> extends HopQuery<TIn, TOut> {
    static create<TIn, TOut>(sourceQuery: Query<TIn>, sourceSpec: ModelSpec<TIn>, destSpec: ModelSpec<TOut>): SQLHopQuery<TIn, TOut>;
}
