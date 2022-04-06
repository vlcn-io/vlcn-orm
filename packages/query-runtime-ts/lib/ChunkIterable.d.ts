export interface ChunkIterable<T> {
    [Symbol.asyncIterator](): AsyncIterator<readonly T[]>;
    gen(): Promise<readonly T[]>;
}
export declare abstract class BaseChunkIterable<T> implements ChunkIterable<T> {
    abstract [Symbol.asyncIterator](): AsyncIterator<readonly T[]>;
    gen(): Promise<readonly T[]>;
    map<TOut>(fn: (T: any) => Promise<TOut>): ChunkIterable<TOut>;
}
export declare class StaticSourceChunkIterable<T> extends BaseChunkIterable<T> {
    private source;
    constructor(source: T[][]);
    [Symbol.asyncIterator](): AsyncIterator<readonly T[]>;
}
export declare class PromiseSourceSingleChunkIterable<T> extends BaseChunkIterable<T> {
    private source;
    constructor(source: Promise<T[]>);
    [Symbol.asyncIterator](): AsyncIterator<readonly T[]>;
}
export declare class MappedChunkIterable<TIn, TOut> extends BaseChunkIterable<TOut> {
    private source;
    private fn;
    constructor(source: ChunkIterable<TIn>, fn: (TIn: any) => Promise<TOut>);
    [Symbol.asyncIterator](): AsyncIterator<readonly TOut[]>;
}
export declare class SyncMappedChunkIterable<TIn, TOut> extends BaseChunkIterable<TOut> {
    private source;
    private fn;
    constructor(source: ChunkIterable<TIn>, fn: (TIn: any) => TOut);
    [Symbol.asyncIterator](): AsyncIterator<readonly TOut[]>;
}
export declare class FilteredChunkIterable<T> extends BaseChunkIterable<T> {
    private source;
    private fn;
    constructor(source: ChunkIterable<T>, fn: (T: any) => Promise<boolean>);
    [Symbol.asyncIterator](): AsyncIterator<readonly T[]>;
}
export declare class TakeChunkIterable<T> extends BaseChunkIterable<T> {
    private source;
    private num;
    constructor(source: ChunkIterable<T>, num: number);
    [Symbol.asyncIterator](): AsyncIterator<readonly T[]>;
}
