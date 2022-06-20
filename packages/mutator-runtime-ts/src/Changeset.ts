import {
  INode,
  NodeSpecWithCreate,
  ChangesetOptions,
  CreateChangeset,
  UpdateChangeset,
  DeleteChangeset,
} from '@aphro/context-runtime-ts';
import { SID_of } from '@strut/sid';

export function updateChangeset<M extends INode<D>, D>(
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

export function createChangeset<M extends INode<D>, D>(
  spec: NodeSpecWithCreate<M, D>,
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

export function deleteChangeset<M extends INode<D>, D>(
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
