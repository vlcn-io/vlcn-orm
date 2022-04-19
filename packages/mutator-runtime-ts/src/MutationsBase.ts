import { IModel, ModelSpec } from '@aphro/model-runtime-ts';
import { ICreateOrUpdateBuilder } from './Mutator.js';
import { __internalConfig } from '@aphro/config-runtime-ts';
import changesetToSQL from './sql/changesetToSQL.js';
import { Changeset } from './Changeset.js';

type Query = {
  queryString: string;
  bindings: any[];
};

export default abstract class MutationsBase<M extends IModel<D>, D extends Object> {
  constructor(private spec: ModelSpec<M, D>, protected mutator: ICreateOrUpdateBuilder<M, D>) {}

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
    const cs = this.mutator.toChangeset({
      returning: true,
    });
    const query = this.getQuery(cs);
    throw new Error('todo');
  }

  private getQuery(cs: Changeset<M, D>): Query {
    switch (this.spec.storage.type) {
      case 'sql':
        return changesetToSQL(this.spec, cs);
    }
  }

  toChangeset(): Changeset<M, D> {
    return this.mutator.toChangeset();
  }
}
