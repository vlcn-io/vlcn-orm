import { Context } from '@aphro/context-runtime-ts';
import { IModel } from '@aphro/model-runtime-ts';
import { ChunkIterable, SyncMappedChunkIterable } from './ChunkIterable';
import { DerivedExpression } from './Expression';

export default class ModelLoadExpression<TData, TModel extends IModel<TData>>
  implements DerivedExpression<TData, TModel>
{
  readonly type = 'modelLoad';
  constructor(private ctx: Context, private factory: (ctx: Context, data: TData) => TModel) {}

  chainAfter(iterable: ChunkIterable<TData>) {
    return new SyncMappedChunkIterable(iterable, d => this.factory(this.ctx, d));
  }
}
