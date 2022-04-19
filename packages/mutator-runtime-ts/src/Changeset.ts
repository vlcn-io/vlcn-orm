import { IModel, ModelSpec } from '@aphro/model-runtime-ts';

export type ChangesetOptions = {
  returning: boolean;
};

export type Changeset<M extends IModel<D>, D> =
  | CreateChangeset<M, D>
  | UpdateChangeset<M, D>
  | DeleteChangeset<M, D>;

export type CreateChangeset<M extends IModel<D>, D> = {
  type: 'create';
  updates: Partial<D>;
  spec: ModelSpec<M, D>;
  options?: ChangesetOptions;
};

export type UpdateChangeset<M extends IModel<D>, D> = {
  type: 'update';
  updates: Partial<D>;
  spec: ModelSpec<M, D>;
  options?: ChangesetOptions;
};

export type DeleteChangeset<M extends IModel<D>, D> = {
  type: 'delete';
  model: M;
  spec: ModelSpec<M, D>;
  options?: ChangesetOptions;
};

export function updateChangeset<M extends IModel<D>, D>(
  spec: ModelSpec<M, D>,
  updates: D,
  options?: ChangesetOptions,
): Changeset<M, D> {
  return {
    type: 'update',
    updates,
    spec,
    options,
  };
}

export function createChangeset<M extends IModel<D>, D>(
  spec: ModelSpec<M, D>,
  updates: D,
  options?: ChangesetOptions,
): CreateChangeset<M, D> {
  return {
    type: 'create',
    updates,
    spec,
    options,
  };
}

export function deleteChangeset<M extends IModel<D>, D>(
  spec: ModelSpec<M, D>,
  model: M,
  options?: ChangesetOptions,
): DeleteChangeset<M, D> {
  return {
    type: 'delete',
    model,
    spec,
    options,
  };
}
