import { NodeSpec } from '@aphro/schema-api';
import { SID_of } from '@strut/sid';
import { Context } from './context.js';
type Disposer = () => void;

export type ModelSpec<M extends IModel<D>, D extends {}> = {
  createFrom(context: Context, data: D): M;
} & NodeSpec;

export interface IModel<T extends {} = Object> {
  readonly id: SID_of<this>;
  readonly ctx: Context;
  readonly spec: ModelSpec<this, T>;

  subscribe(c: () => void): Disposer;
  subscribeTo(keys: (keyof T)[], c: () => void): Disposer;

  destroy();

  // Internal only APIs. Exposed since TS doesn't understand package friends.
  // TODO: Or does it? I can extend a type that exists in a package from another package...
  // So why not do that to make these methods local to the package(s) that need them?
  _get<K extends keyof T>(key: K): T[K];
  _d(): T;
  _merge(newData: Partial<T>): [Partial<T>, Set<() => void>];
  _isNoop(updates: Partial<T>): boolean;
}
