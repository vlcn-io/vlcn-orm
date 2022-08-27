import { Context, IModel, INode } from '@aphro/context-runtime-ts';
import { ChunkIterable, SyncMappedChunkIterable } from './ChunkIterable';
import { DerivedExpression } from './Expression';

/**
 * More context on Expressions exists in `./Expression.ts`
 *
 * A ModelLoadExpression is a DerivedExpression that converts raw data
 * returned by the data source into `Aphrodite` model instances.
 *
 * E.g., If you defined a `Todo` node in your schema then queried all todos,
 * a `ModelLoadExpression` is added to this query to convert the rows to `Todo` instances.
 */
export default class ModelLoadExpression<TData extends {}, TModel extends IModel<TData>>
  implements DerivedExpression<TData, TModel>
{
  readonly type = 'modelLoad';
  constructor(private ctx: Context, private factory: (ctx: Context, data: TData) => TModel) {}

  chainAfter(iterable: ChunkIterable<TData>) {
    return iterable.map(d => this.factory(this.ctx, d));
  }
}
