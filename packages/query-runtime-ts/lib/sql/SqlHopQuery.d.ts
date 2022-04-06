import { HopQuery, Query } from '../Query.js';
import { Spec } from '@aphro/model-runtime-ts';
export default class SQLHopQuery<TIn, TOut> extends HopQuery<TIn, TOut> {
    static create<TIn, TOut>(sourceQuery: Query<TIn>, sourceSpec: Spec<TIn>, destSpec: Spec<TOut>): SQLHopQuery<TIn, TOut>;
}
