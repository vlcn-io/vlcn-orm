import { IMutationBuilder } from './Mutator.js';
import { commit } from './commit.js';
import {
  Context,
  Changeset,
  ChangesetOptions,
  IModel,
  CommitPromise,
} from '@aphro/context-runtime-ts';

export default abstract class MutationsBase<M extends IModel<D>, D extends Object> {
  readonly ctx: Context;
  constructor(ctx: Context, protected mutator: IMutationBuilder<M, D>) {
    this.ctx = ctx;
  }

  save(): CommitPromise<M> {
    return this.mutator.toChangeset().save();
  }

  save0(): M {
    return this.mutator.toChangeset().save0();
  }

  // TODO: saveAndReturn ...

  // async saveAndReturn(): Promise<M> {
  //   const cs = this.mutator.toChangeset({
  //     returning: true,
  //   });

  //   const results = await changesetExecutor([cs]).exec();
  //   return results[0] as M;
  // }

  toChangeset(options?: ChangesetOptions): Changeset<M, D> {
    return this.mutator.toChangeset(options);
  }
}
