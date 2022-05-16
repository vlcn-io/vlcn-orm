import { IModel } from '@aphro/model-runtime-ts';
import { ICreateOrUpdateBuilder } from './Mutator.js';
import { Changeset, ChangesetOptions } from './Changeset.js';
import { commit } from './commit.js';
import { Context } from '@aphro/context-runtime-ts';

export default abstract class MutationsBase<M extends IModel<D>, D extends Object> {
  readonly ctx: Context;
  constructor(ctx: Context, protected mutator: ICreateOrUpdateBuilder<M, D>) {
    this.ctx = ctx;
  }

  save(): [M | null, Promise<void>] {
    const cs = this.mutator.toChangeset();
    const [optimistic, persist] = commit(this.ctx, [cs]);
    return [optimistic.nodes.get(cs.id), persist];
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
