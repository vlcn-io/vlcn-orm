export interface ChunkIterable<T> {
  [Symbol.asyncIterator](): AsyncIterator<readonly T[]>;

  gen(): Promise<readonly T[]>;

  map<TOut>(fn: (x: T) => TOut): ChunkIterable<TOut>;
  mapAsync<TOut>(fn: (x: T) => Promise<TOut>): ChunkIterable<TOut>;
  filter(fn: (x: T) => boolean): ChunkIterable<T>;
}

export abstract class BaseChunkIterable<T> implements ChunkIterable<T> {
  abstract [Symbol.asyncIterator](): AsyncIterator<readonly T[]>;

  async gen(): Promise<readonly T[]> {
    let ret: T[] = [];
    for await (const chunk of this) {
      ret = ret.concat(chunk);
    }

    return ret;
  }

  mapAsync<TOut>(fn: (x: T) => Promise<TOut>): ChunkIterable<TOut> {
    return new MappedChunkIterable(this, fn);
  }

  map<TOut>(fn: (x: T) => TOut): ChunkIterable<TOut> {
    return new SyncMappedChunkIterable(this, fn);
  }

  filter(fn: (x: T) => boolean): ChunkIterable<T> {
    return new SyncFilteredChunkIterable(this, fn);
  }

  filterAsync(fn: (x: T) => Promise<boolean>): ChunkIterable<T> {
    return new FilteredChunkIterable(this, fn);
  }
}

export class StaticSourceChunkIterable<T> extends BaseChunkIterable<T> {
  constructor(private source: T[][]) {
    super();
  }

  async *[Symbol.asyncIterator](): AsyncIterator<readonly T[]> {
    for (const chunk of this.source) {
      yield chunk;
    }
  }
}

export const emptyChunkIterable = new StaticSourceChunkIterable([]);

export class PromiseSourceSingleChunkIterable<T> extends BaseChunkIterable<T> {
  constructor(private source: Promise<T[]>) {
    super();
  }

  async *[Symbol.asyncIterator](): AsyncIterator<readonly T[]> {
    const ret = await this.source;

    yield ret;
  }
}

export class MappedChunkIterable<TIn, TOut> extends BaseChunkIterable<TOut> {
  constructor(private source: ChunkIterable<TIn>, private fn: (TIn) => Promise<TOut>) {
    super();
  }

  async *[Symbol.asyncIterator](): AsyncIterator<readonly TOut[]> {
    for await (const chunk of this.source) {
      yield Promise.all(chunk.map(this.fn));
    }
  }
}

export class SyncMappedChunkIterable<TIn, TOut> extends BaseChunkIterable<TOut> {
  constructor(private source: ChunkIterable<TIn>, private fn: (TIn) => TOut) {
    super();
  }

  async *[Symbol.asyncIterator](): AsyncIterator<readonly TOut[]> {
    for await (const chunk of this.source) {
      yield chunk.map(this.fn);
    }
  }
}

export class FilteredChunkIterable<T> extends BaseChunkIterable<T> {
  constructor(private source: ChunkIterable<T>, private fn: (T) => Promise<boolean>) {
    super();
  }

  async *[Symbol.asyncIterator](): AsyncIterator<readonly T[]> {
    for await (const chunk of this.source) {
      const filterResults = Promise.all(chunk.map(this.fn));
      const filteredChunk: T[] = [];
      for (let i = 0; i < chunk.length; ++i) {
        if (filterResults[i]) {
          filteredChunk.push(chunk[i]);
        }
      }
      if (filteredChunk.length > 0) {
        yield filteredChunk;
      }
    }
  }
}

export class SyncFilteredChunkIterable<T> extends BaseChunkIterable<T> {
  constructor(private source: ChunkIterable<T>, private fn: (T) => boolean) {
    super();
  }

  async *[Symbol.asyncIterator](): AsyncIterator<readonly T[]> {
    for await (const chunk of this.source) {
      const filterResults = chunk.map(this.fn);
      const filteredChunk: T[] = [];
      for (let i = 0; i < chunk.length; ++i) {
        if (filterResults[i]) {
          filteredChunk.push(chunk[i]);
        }
      }
      if (filteredChunk.length > 0) {
        yield filteredChunk;
      }
    }
  }
}

export class TakeChunkIterable<T> extends BaseChunkIterable<T> {
  constructor(private source: ChunkIterable<T>, private num: number) {
    super();
  }

  async *[Symbol.asyncIterator](): AsyncIterator<readonly T[]> {
    let numLeft = this.num;
    if (numLeft === 0) {
      return [];
    }

    for await (const chunk of this.source) {
      if (chunk.length < numLeft) {
        yield chunk;
        numLeft -= chunk.length;
      } else {
        yield chunk.slice(0, numLeft);
        numLeft = 0;
        break;
      }
    }
  }
}
