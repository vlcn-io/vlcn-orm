import { invariant } from '@strut/utils';
import { HopQuery } from '../Query.js';
export default class SQLHopQuery extends HopQuery {
    /*
    A SQL hop query means that the next thing is SQL backed.
    We'll take source and see what the source is to determine what HOP
    expression to construct?
    */
    static create(sourceQuery, edge) {
        // based on source and dest spec, determine the appropriate hop expression
        return new SQLHopQuery(sourceQuery, createExpression(edge));
    }
}
function createExpression(edge) {
    if (edge.source.storage.type === 'sql') {
        invariant(edge.dest.storage.type === 'sql', 'SQLHopQuery created for non-sql destination');
        // If we're the same storage on the same DB, we can use a join expression
        if (edge.source.storage.db === edge.dest.storage.db) {
            return createJoinExpression(edge);
        }
    }
    return createChainedHopExpression(edge);
}
function createJoinExpression(edge) {
    throw new Error('Join not yet supported');
}
function createChainedHopExpression(edge) {
    throw new Error('In memory hop not yet supported');
}
//# sourceMappingURL=SqlHopQuery.js.map