import {
  Changeset,
  Context,
  IModel,
  OptimisticPromise,
  SavableChangeset,
} from '@aphro/context-runtime-ts';
import { commit } from './commit.js';

export default function makeSavable<M extends IModel<D>, D extends {}>(
  ctx: Context,
  cs: Changeset<M, D>,
): Changeset<M, D> & SavableChangeset<M, D> {
  return {
    ...cs,
    save(): OptimisticPromise<M> {
      return commit(ctx, cs);
    },
    save0(): M {
      return commit(ctx, cs).optimistic;
    },
  };
}
