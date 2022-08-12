/**
 * Chunk iterables are used in two cases.
 * Case 1: To process a large datastream in batches rather than all at once or one at a time.
 *   This is a spatial performance and time-to-first-result optimization
 * Case 2: To allow query operations that cannot be done in the database to be done in the application.
 *   This allows developers to add filters to their queries that run arbitrary bits of code.
 *
 * See more on chunk iterables here: https://tantaman.com/2022-05-26-chunk-iterable.html
 */
export interface ChunkIterable<T> {
  [Symbol.asyncIterator](): AsyncIterator<readonly T[]>;

  gen(): Promise<readonly T[]>;

  map<TOut>(fn: (x: T) => TOut): ChunkIterable<TOut>;
  mapAsync<TOut>(fn: (x: T) => Promise<TOut>): ChunkIterable<TOut>;
  filter(fn: (x: T) => boolean): ChunkIterable<T>;
  filterAsync(fn: (x: T) => Promise<boolean>): ChunkIterable<T>;
  orderBy(fn: (l: T, r: T) => number): ChunkIterable<T>;
  // orderByAsync(fn: (l: T, r: T) => Promise<number>): ChunkIterable<T>;
  take(n: number): ChunkIterable<T>;
  count(): ChunkIterable<number>;

  union(other: ChunkIterable<T>): ChunkIterable<T>;
}

export abstract class BaseChunkIterable<T> implements ChunkIterable<T> {
  // TODO: we should probs memoize the results of this...
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

  orderBy(fn: (l: T, r: T) => number): ChunkIterable<T> {
    return new OrderedChunkIterable(this, fn);
  }

  take(n: number): ChunkIterable<T> {
    return new TakeChunkIterable(this, n);
  }

  count(): ChunkIterable<number> {
    return new CountChunkIterable(this);
  }

  union(other: ChunkIterable<T>): ChunkIterable<T> {
    return new ConcatenatedChunkIterable([this, other]);
  }
}

export class ConcatenatedChunkIterable<T> extends BaseChunkIterable<T> {
  constructor(private pieces: BaseChunkIterable<T>[]) {
    super();
  }

  async *[Symbol.asyncIterator](): AsyncIterator<readonly T[]> {
    for (const piece of this.pieces) {
      for await (const chunk of piece) {
        yield chunk;
      }
    }
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
  constructor(private source: ChunkIterable<TIn>, private fn: (x: TIn) => Promise<TOut>) {
    super();
  }

  async *[Symbol.asyncIterator](): AsyncIterator<readonly TOut[]> {
    for await (const chunk of this.source) {
      yield await Promise.all(chunk.map(this.fn));
    }
  }
}

export class SyncMappedChunkIterable<TIn, TOut> extends BaseChunkIterable<TOut> {
  constructor(private source: ChunkIterable<TIn>, private fn: (x: TIn) => TOut) {
    super();
  }

  async *[Symbol.asyncIterator](): AsyncIterator<readonly TOut[]> {
    for await (const chunk of this.source) {
      yield chunk.map(this.fn);
    }
  }
}

export class FilteredChunkIterable<T> extends BaseChunkIterable<T> {
  constructor(private source: ChunkIterable<T>, private fn: (x: T) => Promise<boolean>) {
    super();
  }

  async *[Symbol.asyncIterator](): AsyncIterator<readonly T[]> {
    for await (const chunk of this.source) {
      const filterResults = await Promise.all(chunk.map(this.fn));
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
  constructor(private source: ChunkIterable<T>, private fn: (x: T) => boolean) {
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

// Ordering in a chunk iterable is insanely expensive :(
// We need to warn the user if/when their queries do this
export class OrderedChunkIterable<T> extends BaseChunkIterable<T> {
  constructor(private source: ChunkIterable<T>, private fn: (l: T, r: T) => number) {
    super();
  }

  async *[Symbol.asyncIterator](): AsyncIterator<readonly T[]> {
    let all: T[] = [];
    for await (const chunk of this.source) {
      all = all.concat(chunk);
    }
    yield all.sort(this.fn);
  }
}

export class CountChunkIterable<T> extends BaseChunkIterable<number> {
  constructor(private source: ChunkIterable<T>) {
    super();
  }

  async *[Symbol.asyncIterator](): AsyncIterator<readonly number[]> {
    let count = 0;
    for await (const chunk of this.source) {
      count += chunk.length;
    }
    yield [count];
  }
}
