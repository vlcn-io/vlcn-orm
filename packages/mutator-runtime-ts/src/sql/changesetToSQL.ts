import { Changeset, IModel, ModelSpec } from '@aphro/model-runtime-ts';

export default function changesetToSQL<D, M extends IModel<D>>(
  spec: ModelSpec<D, M>,
  changeset: Changeset<M, D>,
  returning: boolean = false,
): { queryString: string; bindings: any[] } {
  return {
    queryString: '',
    bindings: [],
  };
}
