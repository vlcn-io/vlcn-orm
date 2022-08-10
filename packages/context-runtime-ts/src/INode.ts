import { JunctionEdgeSpec, NodeSpec } from '@aphro/schema-api';
import { SID_of } from '@strut/sid';
import { Context } from './context.js';
type Disposer = () => void;

export type ModelCreate<M extends IModel<D>, D extends {}> = {
  createFrom(context: Context, data: D, raw?: boolean): M;
};

export type NodeSpecWithCreate<M extends INode<D>, D extends {}> = ModelCreate<M, D> & NodeSpec;
export type EdgeSpecWithCreate<M extends IEdge<D>, D extends {}> = ModelCreate<M, D> &
  JunctionEdgeSpec;
export type ModelSpecWithCreate<M extends IModel<D>, D extends {}> = ModelCreate<M, D> &
  (NodeSpec | JunctionEdgeSpec);

export interface IModel<T extends {} = Object> {
  readonly id: SID_of<this>;
  readonly spec: ModelSpecWithCreate<this, T>;

  subscribe(c: () => void): Disposer;
  subscribeTo(keys: (keyof T)[], c: () => void): Disposer;

  destroy(): void;

  // Internal only APIs. Exposed since TS doesn't understand package friends.
  // TODO: Or does it? I can extend a type that exists in a package from another package...
  // So why not do that to make these methods local to the package(s) that need them?
  _get<K extends keyof T>(key: K): T[K];
  _d(): T;
  _merge(newData: Partial<T>): [Partial<T>, Set<() => void>];
  _isNoop(updates: Partial<T>): boolean;
}

export interface INode<T extends {} = Object> extends IModel<T> {
  readonly spec: NodeSpecWithCreate<this, T>;
}

export interface IEdge<T extends {} = Object> extends IModel<T> {
  readonly spec: EdgeSpecWithCreate<this, T>;
}
