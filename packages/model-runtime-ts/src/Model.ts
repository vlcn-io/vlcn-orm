import { SID_of } from '@strut/sid';
import { NodeSpec } from '@aphro/schema-api';

export interface IModel<T extends Object> {
  // Internal only APIs. Exposed since TS doesn't understand package friends.
  _get<K extends keyof T>(key: K): T[K];
  _d(): T;
}

export type ModelSpec<M extends IModel<D>, D extends Object> = {
  createFrom(data: D): M;
} & NodeSpec;

export interface HasId {
  readonly id: SID_of<this>;
}

export function isHasId(object: any): object is HasId {
  return 'id' in object && typeof object.id === 'string';
}

export default class Model<T extends Object> implements IModel<T> {
  protected readonly data: T;

  constructor(data: T) {
    this.data = Object.seal(data);
  }

  _get<K extends keyof T>(key: K): T[K] {
    return this.data[key];
  }

  _d(): T {
    return this.data;
  }
}
