import { ModelSpec } from '@aphro/model-runtime-ts';
import { EdgeSpec } from '@aphro/schema-api';
import { DerivedQuery, HopQuery, Query } from './Query.js';
declare const factory: {
    createSourceQueryFor<T>(spec: ModelSpec<T>): Query<T>;
    createHopQueryFor<TDest>(priorQuery: DerivedQuery<any>, edge: EdgeSpec): HopQuery<any, any>;
};
export default factory;
