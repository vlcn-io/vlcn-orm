import { Context, IModel } from '@aphro/context-runtime-ts';
import { ChunkIterable, SyncMappedChunkIterable } from './ChunkIterable';
import { DerivedExpression } from './Expression';

export default class ModelLoadExpression<TData, TModel extends IModel<TData>>
  implements DerivedExpression<TData, TModel>
{
  readonly type = 'modelLoad';
  constructor(private ctx: Context, private factory: (ctx: Context, data: TData) => TModel) {}

  chainAfter(iterable: ChunkIterable<TData>) {
    return iterable.map(d => this.factory(this.ctx, d));
  }
}
