import SQLHopQuery from './sql/SqlHopQuery.js';
import SQLSourceQuery from './sql/SqlSourceQuery.js';
// Runtime factory so we can swap to `Wire` when running on a client vs
// the native platform.
const factory = {
    createSourceQueryFor(spec) {
        switch (spec.storageDescriptor.type) {
            case 'sql':
                return new SQLSourceQuery(spec);
            default:
                throw new Error(spec.storageDescriptor.type + ' is not yet supported');
        }
    },
    createHopQueryFor(priorQuery, sourceSpec, destSpec) {
        // SQLHopQuery and so on
        if (destSpec.storageDescriptor.type === 'sql') {
            return SQLHopQuery.create(priorQuery, sourceSpec, destSpec);
        }
        throw new Error('Unimplemented hop');
    },
};
export default factory;
//# sourceMappingURL=QueryFactory.js.map