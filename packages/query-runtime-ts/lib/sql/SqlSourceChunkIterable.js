import { BaseChunkIterable } from '../ChunkIterable.js';
export default class SQLSourceChunkIterable extends BaseChunkIterable {
    constructor(spec, hoistedOperations) {
        super();
    }
    async *[Symbol.asyncIterator]() {
        // now take our hoisted operations and craft the SQL query we need.
    }
}
//# sourceMappingURL=SqlSourceChunkIterable.js.map