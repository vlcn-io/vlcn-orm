import { BaseChunkIterable } from '../ChunkIterable.js';
import specAndOpsToQuery from './specAndOpsToQuery.js';
import { HoistedOperations } from './SqlExpression.js';
import { invariant } from '@strut/utils';
import { Context, IModel } from '@aphro/context-runtime-ts';
import { NodeSpec } from '@aphro/schema-api';
import { formatters } from '@aphro/sql-ts';

export default class SQLSourceChunkIterable<T extends IModel<Object>> extends BaseChunkIterable<T> {
  constructor(
    private ctx: Context,
    private spec: NodeSpec,
    private hoistedOperations: HoistedOperations,
  ) {
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
    const resolvedDb = this.ctx.dbResolver
      .engine(this.spec.storage.engine)
      .db(this.spec.storage.db);
    const sql = specAndOpsToQuery(this.spec, this.hoistedOperations);
    yield await resolvedDb.exec(sql);
  }
}
