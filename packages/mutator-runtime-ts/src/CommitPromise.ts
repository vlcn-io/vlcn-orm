import { IModel } from '@aphro/model-runtime-ts';
import ImmutableHeteroModelMap from '@aphro/model-runtime-ts/src/HeteroModelMap';
import { Changeset } from './Changeset';

type Executor<T> = (
  resolve: (value: T | PromiseLike<T>) => void,
  reject: (reason?: any) => void,
) => void;

export default class CommitPromise extends Promise<void> {
  constructor(private readonly models: ImmutableHeteroModelMap, executor: Executor<void>) {
    super(executor);
  }

  at<M extends IModel<D>, D extends Object>(cs: Changeset<M, D>) {
    return this.models.getx(cs.id);
  }
}
