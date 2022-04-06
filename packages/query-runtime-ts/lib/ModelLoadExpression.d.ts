import { IModel } from '@aphro/model-runtime-ts';
import { ChunkIterable, SyncMappedChunkIterable } from './ChunkIterable';
import { DerivedExpression } from './Expression';
export default class ModelLoadExpression<TData, TModel extends IModel<TData>> implements DerivedExpression<TData, TModel> {
    private factory;
    readonly type = "modelLoad";
    constructor(factory: (TData: any) => TModel);
    chainAfter(iterable: ChunkIterable<TData>): SyncMappedChunkIterable<TData, TModel>;
}
