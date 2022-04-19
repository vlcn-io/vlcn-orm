import { IModel, ModelSpec } from '@aphro/model-runtime-ts';
import { Changeset } from 'Changeset';
import changesetToSQL from './sql/changesetToSQL.js';
import { __internalConfig } from '@aphro/config-runtime-ts';

type Query = {
  queryString: string;
  bindings: any[];
};

// TODO should we collapse multiple mutations of the same model into a single CS?
// The collection could be hetorogonous hence the any, any
export default function changesetExecutor(changesets: Changeset<any, any>[]) {
  // TODO Go thru changesets
  // Group into batches that could be batched based on storage being hit
  // We could batch here or in the db resolver on the next tick
  // How shall we return results back out to our users?
  // Supply `return` to changeset creation?
  // return tuples?
  return {
    async exec(): Promise<(IModel<any> | null)[]> {
      const queries = changesets.map(cs => getQuery(cs));
      const results = await Promise.all(
        queries.map(query =>
          __internalConfig.resolver
            .type(this.spec.storage.type)
            .engine(this.spec.storage.engine)
            .tablish(this.spec.storage.tablish)
            .exec(query.queryString, query.bindings),
        ),
      );

      return results;
    },
  };
}

function getQuery<M extends IModel<D>, D extends Object>(cs: Changeset<M, D>): Query {
  switch (cs.spec.storage.type) {
    case 'sql':
      return changesetToSQL(this.spec, cs);
  }
}
