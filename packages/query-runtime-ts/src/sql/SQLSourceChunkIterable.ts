import { IModel, ModelSpec } from '@aphro/model-runtime-ts';
import { BaseChunkIterable } from '../ChunkIterable.js';
import specAndOpsToQuery from './specAndOpsToQuery.js';
import { HoistedOperations } from './SqlSourceExpression.js';
import { invariant } from '@strut/utils';
import { __internalConfig } from '@aphro/config-runtime-ts';

export default class SQLSourceChunkIterable<T extends IModel<Object>> extends BaseChunkIterable<T> {
  constructor(private spec: ModelSpec<T, Object>, private hoistedOperations: HoistedOperations) {
    super();
    invariant(this.spec.storage.type === 'sql', 'SQL source used for non-SQL model!');
  }

  async *[Symbol.asyncIterator](): AsyncIterator<readonly T[]> {
    // TODO: stronger types one day
    // e.g., exec should by parametrized and checked against T somehow.
    // Should probably allow a namespace too?
    // also... this is pretty generic and would apply to non-sql data sources too.
    // given the actual query execution happens in the resolver.
    // also -- should we chunk it at all?
    return await specAndOpsToQuery(
      this.spec,
      this.hoistedOperations,
      __internalConfig.resolver
        .type(this.spec.storage.type)
        .engine(this.spec.storage.engine)
        .db(this.spec.storage.db),
    );
  }
}
