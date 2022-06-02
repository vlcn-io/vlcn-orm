import { IModel, ModelSpec } from '@aphro/model-runtime-ts';
import { SID_of } from '@strut/sid';

export type ChangesetOptions = {
  returning: boolean;
};

export type Changeset<M extends IModel<D>, D = Object> =
  | CreateChangeset<M, D>
  | UpdateChangeset<M, D>
  | DeleteChangeset<M, D>;

export type CreateChangeset<M extends IModel<D>, D> = {
  type: 'create';
  updates: Partial<D>;
  spec: ModelSpec<M, D>;
  options?: ChangesetOptions;
  id: SID_of<M>;
};

export type UpdateChangeset<M extends IModel<D>, D> = {
  type: 'update';
  updates: Partial<D>;
  spec: ModelSpec<M, D>;
  model: M;
  options?: ChangesetOptions;
  id: SID_of<M>;
};

export type DeleteChangeset<M extends IModel<D>, D> = {
  type: 'delete';
  model: M;
  spec: ModelSpec<M, D>;
  options?: ChangesetOptions;
  id: SID_of<M>;
};

export default {};
