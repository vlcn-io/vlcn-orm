import { HopQuery, Query } from '../Query.js';
import { EdgeSpec } from '@aphro/schema-api';
export default class SQLHopQuery<TIn, TOut> extends HopQuery<TIn, TOut> {
    static create<TIn, TOut>(sourceQuery: Query<TIn>, edge: EdgeSpec): SQLHopQuery<TIn, unknown>;
}
