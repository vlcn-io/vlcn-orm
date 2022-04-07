import { ModelSpec } from '@aphro/model-runtime-ts';
import { DerivedQuery, HopQuery, Query } from './Query.js';
import SQLHopQuery from './sql/SqlHopQuery.js';
import SQLSourceQuery from './sql/SqlSourceQuery.js';

// Runtime factory so we can swap to `Wire` when running on a client vs
// the native platform.
const factory = {
  createSourceQueryFor<T>(spec: ModelSpec<T>): Query<T> {
    switch (spec.storage.type) {
      case 'sql':
        return new SQLSourceQuery(spec);
      default:
        throw new Error(spec.storage.type + ' is not yet supported');
    }
  },

  createHopQueryFor<TDest>(
    priorQuery: DerivedQuery<any>,
    sourceSpec: ModelSpec<any>,
    destSpec: ModelSpec<TDest>,
  ): HopQuery<any, TDest> {
    // SQLHopQuery and so on
    if (destSpec.storage.type === 'sql') {
      return SQLHopQuery.create(priorQuery, sourceSpec, destSpec);
    }

    throw new Error('Unimplemented hop');
  },
};

export default factory;
