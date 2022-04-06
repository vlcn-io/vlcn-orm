import { Spec } from '@aphro/model-runtime-ts';
import { DerivedQuery, HopQuery, Query } from './Query.js';
declare const factory: {
    createSourceQueryFor<T>(spec: Spec<T>): Query<T>;
    createHopQueryFor<TDest>(priorQuery: DerivedQuery<any>, sourceSpec: Spec<any>, destSpec: Spec<TDest>): HopQuery<any, TDest>;
};
export default factory;
