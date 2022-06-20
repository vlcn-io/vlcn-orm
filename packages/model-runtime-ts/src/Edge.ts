import { Context, IEdge, JunctionEdgeSpecWithCreate } from '@aphro/context-runtime-ts';
import Model from './Model';

export default abstract class Edge<T extends {}> extends Model<T> implements IEdge<T> {
  abstract readonly spec: JunctionEdgeSpecWithCreate<this, T>;

  constructor(ctx: Context, data: T) {
    super(ctx, data);
  }
}
