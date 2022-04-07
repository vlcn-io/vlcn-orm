import SQLHopQuery from './sql/SqlHopQuery.js';
import SQLSourceQuery from './sql/SqlSourceQuery.js';
// Runtime factory so we can swap to `Wire` when running on a client vs
// the native platform.
const factory = {
    createSourceQueryFor(spec) {
        switch (spec.storage.type) {
            case 'sql':
                return new SQLSourceQuery(spec);
            default:
                throw new Error(spec.storage.type + ' is not yet supported');
        }
    },
    // TODO: get types into the edge specs so our hop and have types?
    createHopQueryFor(priorQuery, edge) {
        // SQLHopQuery and so on
        if (edge.dest.storage.type === 'sql') {
            return SQLHopQuery.create(priorQuery, edge);
        }
        throw new Error('Unimplemented hop');
    },
};
export default factory;
//# sourceMappingURL=QueryFactory.js.map