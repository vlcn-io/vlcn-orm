import { IModel } from '@aphro/model-runtime-ts';
import { IMutationBuilder } from './Mutator.js';
import { Changeset, ChangesetOptions } from '@aphro/transaction-runtime-ts';
import { commit } from './commit.js';
import { Context } from '@aphro/context-runtime-ts';

export default abstract class MutationsBase<M extends IModel<D>, D extends Object> {
  readonly ctx: Context;
  constructor(ctx: Context, protected mutator: IMutationBuilder<M, D>) {
    this.ctx = ctx;
  }

  save(): [Promise<void>, M] {
    const cs = this.mutator.toChangeset();
    return commit(this.ctx, [cs]);
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
