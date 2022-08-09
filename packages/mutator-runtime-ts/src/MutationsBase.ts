import { IMutationBuilder } from './Mutator.js';
import {
  Context,
  ChangesetOptions,
  IModel,
  OptimisticPromise,
  Changeset,
} from '@aphro/context-runtime-ts';

export default abstract class MutationsBase<M extends IModel<D>, D extends Object> {
  readonly ctx: Context;
  constructor(ctx: Context, protected mutator: IMutationBuilder<M, D>) {
    this.ctx = ctx;
  }

  save(): OptimisticPromise<M> {
    return this.mutator.toChangesets().save()[0];
  }

  save0(): M {
    return this.mutator.toChangesets().save0()[0];
  }

  // TODO: saveAndReturn ...

  // async saveAndReturn(): Promise<M> {
  //   const cs = this.mutator.toChangeset({
  //     returning: true,
  //   });

  //   const results = await changesetExecutor([cs]).exec();
  //   return results[0] as M;
  // }

  toChangesets(options?: ChangesetOptions): [Changeset<M, D>, ...Changeset<any, any>[]] & {
    save: () => OptimisticPromise<[M, ...any[]]>;
    save0: () => [M, ...any[]];
  } {
    return this.mutator.toChangesets(options);
  }
}
