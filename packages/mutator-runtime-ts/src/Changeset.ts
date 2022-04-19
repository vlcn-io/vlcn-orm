import { IModel, ModelSpec } from '@aphro/model-runtime-ts';

export type Changeset<M extends IModel<D>, D> =
  | CreateChangeset<M, D>
  | UpdateChangeset<M, D>
  | DeleteChangeset<M, D>;

export type CreateChangeset<M extends IModel<D>, D> = {
  type: 'create';
  updates: Partial<D>;
  spec: ModelSpec<M, D>;
};

export type UpdateChangeset<M extends IModel<D>, D> = {
  type: 'update';
  model: M;
  updates: Partial<D>;
  spec: ModelSpec<M, D>;
};

export type DeleteChangeset<M extends IModel<D>, D> = {
  type: 'delete';
  model: M;
  spec: ModelSpec<M, D>;
};

export function updateChangeset<M extends IModel<D>, D>(
  spec: ModelSpec<M, D>,
  model: M,
  updates: D,
): Changeset<M, D> {
  return {
    type: 'update',
    model,
    updates,
    spec,
  };
}

export function createChangeset<M extends IModel<D>, D>(
  spec: ModelSpec<M, D>,
  updates: D,
): CreateChangeset<M, D> {
  return {
    type: 'create',
    updates,
    spec,
  };
}

export function deleteChangeset<M extends IModel<D>, D>(
  spec: ModelSpec<M, D>,
  model: M,
): DeleteChangeset<M, D> {
  return {
    type: 'delete',
    model,
    spec,
  };
}
