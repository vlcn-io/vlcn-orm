import { Context, IEdge } from '@aphro/context-runtime-ts';
import { JunctionEdgeSpec } from '@aphro/schema-api';

// TODO: lots of work to do here such as extracting parts of `Model` to be a based of
// this and `Model`.
// We don't currently allow the user direct access to edges yet so we'll delay these features.
export default abstract class Edge<T extends {}> implements IEdge<T> {
  readonly ctx: Context;
  protected data: T;
  abstract readonly spec: JunctionEdgeSpec;

  constructor(ctx: Context, data: T) {
    this.ctx = ctx;
    this.data = Object.freeze(data);
  }

  _get<K extends keyof T>(key: K): T[K] {
    return this.data[key];
  }

  _d(): T {
    return this.data;
  }

  _merge(newData: Partial<T>): [Partial<T>, Set<() => void>] {
    const lastData = this.data;
    this.data = {
      ...this.data,
      ...newData,
    };
    return [lastData, new Set()];
  }

  _isNoop(updates: Partial<T>) {
    return Object.entries(updates).every(entry => this.data[entry[0]] === entry[1]);
  }
}
