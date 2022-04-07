import { ModelSpec } from '@aphro/model-runtime-ts';
import { DerivedQuery, HopQuery, Query } from './Query.js';
declare const factory: {
    createSourceQueryFor<T>(spec: ModelSpec<T>): Query<T>;
    createHopQueryFor<TDest>(priorQuery: DerivedQuery<any>, sourceSpec: ModelSpec<any>, destSpec: ModelSpec<TDest>): HopQuery<any, TDest>;
};
export default factory;
