import { ModelSpec } from '@aphro/model-runtime-ts';
import { EdgeSpec } from '@aphro/schema-api';
import { DerivedQuery, HopQuery, Query } from './Query.js';
import SQLHopQuery from './sql/SqlHopQuery.js';
import SQLSourceQuery from './sql/SqlSourceQuery.js';

// Runtime factory so we can swap to `Wire` when running on a client vs
// the native platform.
const factory = {
  createSourceQueryFor<T>(spec: ModelSpec<T, any>): Query<T> {
    switch (spec.storage.type) {
      case 'sql':
        return new SQLSourceQuery(spec);
      default:
        throw new Error(spec.storage.type + ' is not yet supported');
    }
  },

  // TODO: get types into the edge specs so our hop and have types?
  createHopQueryFor<TDest>(priorQuery: DerivedQuery<any>, edge: EdgeSpec): HopQuery<any, any> {
    // SQLHopQuery and so on
    if (edge.dest.storage.type === 'sql') {
      return SQLHopQuery.create(priorQuery, edge);
    }

    throw new Error('Unimplemented hop');
  },
};

export default factory;
