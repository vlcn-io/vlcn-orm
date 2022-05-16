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

export function updateChangeset<M extends IModel<D>, D>(
  updates: D,
  model: M,
  options?: ChangesetOptions,
): Changeset<M, D> {
  return {
    type: 'update',
    updates,
    model,
    spec: model.spec,
    options,
    id: model.id,
  };
}

export function createChangeset<M extends IModel<D>, D>(
  spec: ModelSpec<M, D>,
  id: SID_of<M>,
  updates: D,
  options?: ChangesetOptions,
): CreateChangeset<M, D> {
  return {
    type: 'create',
    updates,
    spec,
    options,
    id,
  };
}

export function deleteChangeset<M extends IModel<D>, D>(
  model: M,
  options?: ChangesetOptions,
): DeleteChangeset<M, D> {
  return {
    type: 'delete',
    model,
    spec: model.spec,
    options,
    id: model.id,
  };
}
