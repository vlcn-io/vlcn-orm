import { SyncMappedChunkIterable } from './ChunkIterable';
export default class ModelLoadExpression {
    factory;
    type = 'modelLoad';
    constructor(factory) {
        this.factory = factory;
    }
    chainAfter(iterable) {
        return new SyncMappedChunkIterable(iterable, this.factory);
    }
}
//# sourceMappingURL=ModelLoadExpression.js.map