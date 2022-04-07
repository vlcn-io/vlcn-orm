import { invariant } from '@strut/utils';
import { HopQuery } from '../Query.js';
export default class SQLHopQuery extends HopQuery {
    /*
    A SQL hop query means that the next thing is SQL backed.
    We'll take source and see what the source is to determine what HOP
    expression to construct?
    */
    static create(sourceQuery, sourceSpec, destSpec) {
        // based on source and dest spec, determine the appropriate hop expression
        return new SQLHopQuery(sourceQuery, createExpression(sourceSpec, destSpec));
    }
}
function createExpression(sourceSpec, destSpec) {
    if (sourceSpec.storage.type === 'sql') {
        invariant(destSpec.storage.type === 'sql', 'SQLHopQuery created for non-sql destination');
        // If we're the same storage on the same DB, we can use a join expression
        if (sourceSpec.storage.db === destSpec.storage.db) {
            return createJoinExpression(sourceSpec.storage, destSpec.storage);
        }
    }
    return createChainedHopExpression(sourceSpec.storage, destSpec.storage);
}
function createJoinExpression(sourceDescriptor, destDescriptor) {
    throw new Error('Join not yet supported');
}
function createChainedHopExpression(sourceDescriptor, destDescriptor) {
    throw new Error('In memory hop not yet supported');
}
//# sourceMappingURL=SqlHopQuery.js.map