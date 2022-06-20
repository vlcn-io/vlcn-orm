import { SID_of } from '@strut/sid';
import { INode, NodeSpecWithCreate } from './INode.js';

export type ChangesetOptions = {
  returning: boolean;
};

export type Changeset<M extends INode<D>, D = Object> =
  | CreateChangeset<M, D>
  | UpdateChangeset<M, D>
  | DeleteChangeset<M, D>;

export type CreateChangeset<M extends INode<D>, D> = {
  type: 'create';
  updates: Partial<D>;
  spec: NodeSpecWithCreate<M, D>;
  options?: ChangesetOptions;
  id: SID_of<M>;
};

export type UpdateChangeset<M extends INode<D>, D> = {
  type: 'update';
  updates: Partial<D>;
  spec: NodeSpecWithCreate<M, D>;
  model: M;
  options?: ChangesetOptions;
  id: SID_of<M>;
};

export type DeleteChangeset<M extends INode<D>, D> = {
  type: 'delete';
  model: M;
  spec: NodeSpecWithCreate<M, D>;
  options?: ChangesetOptions;
  id: SID_of<M>;
};
