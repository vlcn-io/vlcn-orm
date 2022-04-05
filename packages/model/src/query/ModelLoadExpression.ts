import { IModel } from "../Model";
import { ChunkIterable, SyncMappedChunkIterable } from "./ChunkIterable";
import { DerivedExpression } from "./Expression";

export default class ModelLoadExpression<TData, TModel extends IModel<TData>>
  implements DerivedExpression<TData, TModel>
{
  readonly type = "modelLoad";
  constructor(private factory: (TData) => TModel) {}

  chainAfter(iterable: ChunkIterable<TData>) {
    return new SyncMappedChunkIterable(iterable, this.factory);
  }
}
