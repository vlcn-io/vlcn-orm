export class BaseChunkIterable {
    async gen() {
        let ret = [];
        for await (const chunk of this) {
            ret = ret.concat(chunk);
        }
        return ret;
    }
    map(fn) {
        return new MappedChunkIterable(this, fn);
    }
}
export class StaticSourceChunkIterable extends BaseChunkIterable {
    source;
    constructor(source) {
        super();
        this.source = source;
    }
    async *[Symbol.asyncIterator]() {
        for (const chunk of this.source) {
            yield chunk;
        }
    }
}
export class PromiseSourceSingleChunkIterable extends BaseChunkIterable {
    source;
    constructor(source) {
        super();
        this.source = source;
    }
    async *[Symbol.asyncIterator]() {
        const ret = await this.source;
        yield ret;
    }
}
export class MappedChunkIterable extends BaseChunkIterable {
    source;
    fn;
    constructor(source, fn) {
        super();
        this.source = source;
        this.fn = fn;
    }
    async *[Symbol.asyncIterator]() {
        for await (const chunk of this.source) {
            yield Promise.all(chunk.map(this.fn));
        }
    }
}
export class SyncMappedChunkIterable extends BaseChunkIterable {
    source;
    fn;
    constructor(source, fn) {
        super();
        this.source = source;
        this.fn = fn;
    }
    async *[Symbol.asyncIterator]() {
        for await (const chunk of this.source) {
            yield chunk.map(this.fn);
        }
    }
}
export class FilteredChunkIterable extends BaseChunkIterable {
    source;
    fn;
    constructor(source, fn) {
        super();
        this.source = source;
        this.fn = fn;
    }
    async *[Symbol.asyncIterator]() {
        for await (const chunk of this.source) {
            const filterResults = Promise.all(chunk.map(this.fn));
            const filteredChunk = [];
            for (let i = 0; i < chunk.length; ++i) {
                if (filterResults[i]) {
                    filteredChunk.push(chunk[i]);
                }
            }
            yield filteredChunk;
        }
    }
}
export class TakeChunkIterable extends BaseChunkIterable {
    source;
    num;
    constructor(source, num) {
        super();
        this.source = source;
        this.num = num;
    }
    async *[Symbol.asyncIterator]() {
        let numLeft = this.num;
        if (numLeft === 0) {
            return [];
        }
        for await (const chunk of this.source) {
            if (chunk.length < numLeft) {
                yield chunk;
                numLeft -= chunk.length;
            }
            else {
                yield chunk.slice(0, numLeft);
                numLeft = 0;
                break;
            }
        }
    }
}
//# sourceMappingURL=ChunkIterable.js.map