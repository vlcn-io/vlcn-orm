import {
  Changeset,
  Context,
  IChangesetArray,
  IModel,
  OptimisticPromise,
} from '@aphro/context-runtime-ts';
import { commit } from './commit';

export default class ChangesetArray<M extends IModel<D>, D>
  extends Array<Changeset<M, D>>
  implements IChangesetArray<M, D>
{
  constructor(public readonly ctx: Context, ...changesets: Changeset<M, D>[]) {
    super(...changesets);
  }

  save(): OptimisticPromise<M[]> {
    // @ts-ignore
    return commit(this.ctx, this);
  }

  save0(): M[] {
    // @ts-ignore
    return commit(this.ctx, this).optimistic;
  }
}
