import { SID_of } from '@strut/sid';
import { Disposer } from '@strut/events';
import { NodeSpec } from '@aphro/schema-api';
import { Context } from '@aphro/context-runtime-ts';

export interface IModel<T extends {}> {
  readonly id: SID_of<this>;
  readonly context: Context;

  subscribe(c: () => void): Disposer;
  subscribeTo(keys: (keyof T)[], c: () => void): Disposer;

  // Internal only APIs. Exposed since TS doesn't understand package friends.
  _get<K extends keyof T>(key: K): T[K];
  _d(): T;

  destroy();
}

export type ModelSpec<M extends IModel<D>, D extends {}> = {
  createFrom(data: D): M;
} & NodeSpec;

export interface HasId {
  readonly id: SID_of<this>;
}

export function isHasId(object: any): object is HasId {
  return 'id' in object && typeof object.id === 'string';
}

export default abstract class Model<T extends {}> implements IModel<T> {
  readonly context: Context;
  abstract readonly id: SID_of<this>;

  protected readonly data: T;

  private subscriptions: Set<() => void> = new Set();
  private keyedSubscriptions: Map<keyof T, Set<() => void>> = new Map();

  constructor(context: Context, data: T) {
    this.context = context;
    this.data = Object.freeze(data);
  }

  _get<K extends keyof T>(key: K): T[K] {
    return this.data[key];
  }
  _d(): T {
    return this.data;
  }

  subscribe(c: () => void): Disposer {
    this.subscriptions.add(c);
    return () => this.subscriptions.delete(c);
  }

  subscribeTo(keys: (keyof T)[], c: () => void): Disposer {
    keys.forEach(k => {
      let subs = this.keyedSubscriptions.get(k);
      if (subs == null) {
        subs = new Set();
        this.keyedSubscriptions.set(k, subs);
      }

      subs.add(c);
    });

    return () => keys.forEach(k => this.keyedSubscriptions.get(k)?.delete(c));
  }

  destroy() {
    this.subscriptions = new Set();
    this.keyedSubscriptions = new Map();
  }
}
