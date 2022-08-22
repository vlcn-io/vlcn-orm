import { Context, IModel, MemoryResolvedDB } from '@aphro/context-runtime-ts';
import { EdgeSpec } from '@aphro/schema-api';
import { BaseChunkIterable, ChunkIterable } from '../ChunkIterable.js';
import { HoistedOperations } from './MemorySourceExpression.js';

export default class MemoryHopChunkIterable<
  TIn extends IModel,
  TOut,
> extends BaseChunkIterable<TOut> {
  constructor(
    private readonly ctx: Context,
    private readonly edge: EdgeSpec,
    private readonly ops: HoistedOperations,
    private readonly source: ChunkIterable<TIn>,
  ) {
    super();
  }

  async *[Symbol.asyncIterator](): AsyncIterator<readonly TOut[]> {
    const db = this.ctx.dbResolver
      .engine(this.edge.dest.storage.engine)
      .db(this.edge.dest.storage.db) as MemoryResolvedDB;
    for await (const chunk of this.source) {
      // field edge -> roots
      // fk edge -> no roots, filter
      // jx edge -> root on jx table followed by roots on final dest
      switch (this.edge.type) {
        case 'field':
          yield await db.read({
            type: 'read',
            tablish: this.edge.dest.storage.tablish,
            // @ts-ignore
            roots: chunk.map(c => c._d()[this.edge.sourceField]),
          });
          break;
        case 'foreignKey':
          // TODO: memoize this given you're re-reading all on every chunk
          const all = await db.read({
            type: 'read',
            tablish: this.edge.dest.storage.tablish,
          });
          const chunkPrimaryKeys = new Set(
            // @ts-ignore
            chunk.map(c => c._d()[this.edge.source.primaryKey]),
          );
          yield all.filter(x => {
            return chunkPrimaryKeys.has(x._d()[this.edge.destField]);
          });
          break;
        case 'junction':
          throw new Error('Junction memory hops not yet implemented');
      }
    }
  }
}
