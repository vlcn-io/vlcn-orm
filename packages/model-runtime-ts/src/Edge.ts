import { Context, IEdge, EdgeSpecWithCreate } from '@aphro/context-runtime-ts';
import Model from './Model.js';

export default abstract class Edge<T extends {}> extends Model<T> implements IEdge<T> {
  abstract readonly spec: EdgeSpecWithCreate<this, T>;

  constructor(ctx: Context, data: T) {
    super(ctx, data);
  }
}
