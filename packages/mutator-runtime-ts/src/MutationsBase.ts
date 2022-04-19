import { IModel } from '@aphro/model-runtime-ts';
import { ICreateOrUpdateBuilder } from './Mutator.js';
import { Changeset, ChangesetOptions } from './Changeset.js';
import changesetExecutor from 'ChangesetExecutor.js';

export default abstract class MutationsBase<M extends IModel<D>, D extends Object> {
  constructor(protected mutator: ICreateOrUpdateBuilder<M, D>) {}

  async save(): Promise<void> {
    await changesetExecutor([this.mutator.toChangeset()]).exec();
  }

  async saveAndReturn(): Promise<M> {
    const cs = this.mutator.toChangeset({
      returning: true,
    });
    const results = await changesetExecutor([cs]).exec();
    return results[0] as M;
  }

  toChangeset(options?: ChangesetOptions): Changeset<M, D> {
    return this.mutator.toChangeset(options);
  }
}
