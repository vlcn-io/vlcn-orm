import { IModel, ModelSpec } from '@aphro/model-runtime-ts';
import { Changeset } from '../Changeset.js';

export default function changesetToSQL<M extends IModel<D>, D extends Object>(
  spec: ModelSpec<M, D>,
  changeset: Changeset<M, D>,
): { queryString: string; bindings: any[] } {
  return {
    queryString: '',
    bindings: [],
  };
}
