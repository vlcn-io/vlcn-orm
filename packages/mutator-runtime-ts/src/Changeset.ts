import { IModel, ModelSpec } from '@aphro/model-runtime-ts';
import { SID_of } from '@strut/sid';
import {
  ChangesetOptions,
  CreateChangeset,
  UpdateChangeset,
  DeleteChangeset,
} from '@aphro/transaction-runtime-ts';

export function updateChangeset<M extends IModel<D>, D>(
  updates: D,
  model: M,
  options?: ChangesetOptions,
): UpdateChangeset<M, D> {
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
