import { IModel, ModelSpec } from '@aphro/model-runtime-ts';
import { ICreateOrUpdateBuilder } from './Mutator.js';
import { __internalConfig } from '@aphro/config-runtime-ts';
import changesetToSQL from './sql/changesetToSQL.js';
import { Changeset } from './Changeset.js';

type Query = {
  queryString: string;
  bindings: any[];
};

export default abstract class MutationsBase<D, M extends IModel<D>> {
  constructor(private spec: ModelSpec<D, M>, protected mutator: ICreateOrUpdateBuilder<D, M>) {}

  async save(): Promise<void> {
    const cs = this.mutator.toChangeset();
    let query: Query;
    switch (this.spec.storage.type) {
      case 'sql':
        query = changesetToSQL(this.spec, cs);
    }
    await __internalConfig.resolver
      .type(this.spec.storage.type)
      .engine(this.spec.storage.engine)
      .tablish(this.spec.storage.tablish)
      .exec(query.queryString, query.bindings);
  }

  async saveAndReturn(): Promise<M> {
    const cs = this.mutator.toChangeset();
    const query = this.getQuery(this.mutator.toChangeset(), true);
    throw new Error('todo');
  }

  private getQuery(cs: Changeset<M, D>, returning: boolean): Query {
    switch (this.spec.storage.type) {
      case 'sql':
        return changesetToSQL(this.spec, cs, returning);
    }
  }

  toChangeset(): Changeset<M, D> {
    return this.mutator.toChangeset();
  }
}
