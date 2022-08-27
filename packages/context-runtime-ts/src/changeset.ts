import { SID_of } from '@strut/sid';
import OptimisticPromise from './OptimisticPromise.js';
import { IModel, ModelSpecWithCreate, NodeSpecWithCreate } from './INode.js';

export type ChangesetOptions = {
  returning: boolean;
};

export type Changeset<M extends IModel<D>, D extends {} = Object> =
  | CreateChangeset<M, D>
  | UpdateChangeset<M, D>
  | DeleteChangeset<M, D>;

export type CreateChangeset<M extends IModel<D>, D extends {}> = {
  type: 'create';
  updates: Partial<D>;
  spec: ModelSpecWithCreate<M, D>;
  options?: ChangesetOptions;
  id: SID_of<M>;
};

export type UpdateChangeset<M extends IModel<D>, D extends {}> = {
  type: 'update';
  updates: Partial<D>;
  spec: ModelSpecWithCreate<M, D>;
  model: M;
  options?: ChangesetOptions;
  id: SID_of<M>;
};

export type DeleteChangeset<M extends IModel<D>, D extends {}> = {
  type: 'delete';
  model: M;
  spec: ModelSpecWithCreate<M, D>;
  options?: ChangesetOptions;
  id: SID_of<M>;
};

export type SavableChangeset<M extends IModel<D>, D extends {}> = {
  save(): OptimisticPromise<M>;
  save0(): M;
};

// export interface IChangesetArray<M extends IModel<D>, D> extends Array<Changeset<M, D>> {
//   save(): OptimisticPromise<M[]>;
//   save0(): M[];
// }
