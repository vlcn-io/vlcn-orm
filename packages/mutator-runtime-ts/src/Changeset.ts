import { IModel } from '@aphro/model-runtime-ts';

export type Changeset<M extends IModel<T>, T> =
  | CreateChangeset<M, T>
  | UpdateChangeset<M, T>
  | DeleteChangeset<M, T>;

export type CreateChangeset<M extends IModel<T>, T> = {
  type: 'create';
  model: M;
  updates: Partial<T>;
};

export type UpdateChangeset<M extends IModel<T>, T> = {
  type: 'update';
  model: M;
  updates: Partial<T>;
};

export type DeleteChangeset<M extends IModel<T>, T> = {
  type: 'delete';
  model: M;
  updates: undefined;
};

export function changeset<M extends IModel<T>, T>(model: M, updates: T): Changeset<M, T> {
  return {
    type: 'update',
    model,
    updates,
  };
}

export function createChangeset<M extends IModel<T>, T>(
  model: M,
  updates: T,
): CreateChangeset<M, T> {
  return {
    type: 'create',
    model,
    updates,
  };
}
