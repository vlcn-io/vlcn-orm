import { BaseChunkIterable } from '../ChunkIterable.js';
import { invariant } from '@strut/utils';
import { Context, IModel, MemoryReadQuery, MemoryResolvedDB } from '@aphro/context-runtime-ts';
import { JunctionEdgeSpec, NodeSpec } from '@aphro/schema-api';

export default class MemorySourceChunkIterable<
  T extends IModel<Object>,
> extends BaseChunkIterable<T> {
  constructor(
    private ctx: Context,
    private spec: NodeSpec | JunctionEdgeSpec,
    private query: MemoryReadQuery,
  ) {
    super();
    invariant(this.spec.storage.type === 'memory', 'Memory source used for non-memory model!');
  }

  async *[Symbol.asyncIterator](): AsyncIterator<readonly T[]> {
    // TODO: stronger types one day
    // e.g., exec should by parametrized and checked against T somehow.
    // Should probably allow a namespace too?
    // also... this is pretty generic and would apply to non-sql data sources too.
    // given the actual query execution happens in the resolver.
    // also -- should we chunk it at all?
    const resolvedDb = this.ctx.dbResolver
      .engine(this.spec.storage.engine)
      .db(this.spec.storage.db) as MemoryResolvedDB;
    yield await resolvedDb.read(this.query);
  }
}
