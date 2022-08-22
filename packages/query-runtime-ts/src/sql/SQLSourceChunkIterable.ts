import { BaseChunkIterable } from '../ChunkIterable.js';
import specAndOpsToQuery from './specAndOpsToQuery.js';
import { HoistedOperations } from './SQLExpression.js';
import { invariant } from '@strut/utils';
import { Context, IModel, SQLResolvedDB } from '@aphro/context-runtime-ts';
import { JunctionEdgeSpec, NodeSpec } from '@aphro/schema-api';
import { ModelFieldGetter } from '../Field.js';
import { SID_of } from '@strut/sid';

export default class SQLSourceChunkIterable<T extends IModel<Object>> extends BaseChunkIterable<T> {
  constructor(
    private ctx: Context,
    private spec: NodeSpec | JunctionEdgeSpec,
    private hoistedOperations: HoistedOperations,
  ) {
    super();
    invariant(this.spec.storage.type === 'sql', 'SQL source used for non-SQL model!');
  }

  // TODO: Should you even do direct load check here?
  // or should you just generate edge methods that check the cache and return a querified object if it is there?
  // also -- won't this be superseded by the query cache?
  async *[Symbol.asyncIterator](): AsyncIterator<readonly T[]> {
    // TODO: stronger types one day
    // e.g., exec should by parametrized and checked against T somehow.
    // Should probably allow a namespace too?
    // also... this is pretty generic and would apply to non-sql data sources too.
    // given the actual query execution happens in the resolver.
    // also -- should we chunk it at all?
    const resolvedDb = this.ctx.dbResolver
      .engine(this.spec.storage.engine)
      .db(this.spec.storage.db) as SQLResolvedDB;

    if (this.hoistedOperations.limit && this.hoistedOperations.limit.num < 1) {
      yield [];
      return;
    }

    // One may wonder how `directLoad` doesn't break follow-on expressions.
    // 1. all follow on expressions _must_ come after a modelLoad
    // 2. modelLoad checks the cache which can be checked wither either a `Model` or `Data` instance
    const directLoad = this.isDirectLoad();
    if (directLoad !== null) {
      const cached = this.ctx.cache.get(
        directLoad,
        this.spec.storage.db,
        this.spec.storage.tablish,
      );
      if (cached != null) {
        yield [cached];
        return;
      }
    }

    const sql = specAndOpsToQuery(this.spec, this.hoistedOperations);
    yield await resolvedDb.read(sql);
  }

  /**
   * A direct load is when we are loading nodes directly by ID and performing no other operations.
   * These queries can be resolved directly from the key-value cache
   *
   * isDirectLoad optimization can likely happen in the planning layer.
   * Being here, each data source would have to implement similar logic.
   * @returns
   */
  private isDirectLoad(): SID_of<any> | null {
    const spec = this.spec;
    if (
      spec.type !== 'node' ||
      this.hoistedOperations.filters?.length !== 1 ||
      this.hoistedOperations.after != null ||
      this.hoistedOperations.before != null ||
      // if there is another hop then this isn't key-value cache resolvable
      this.hoistedOperations.hop != null ||
      // Future: We could presumably also fulfill the ordering needs too
      this.hoistedOperations.orderBy != null
    ) {
      return null;
    }

    // select ids when provoding ids wouldn't make sense
    // Future: resolving a count could be done if cache has all ids
    if (this.hoistedOperations.what !== 'model') {
      return null;
    }

    const filter = this.hoistedOperations.filters[0];
    if (!(filter.getter instanceof ModelFieldGetter)) {
      return null;
    }

    if (filter.getter.fieldName !== spec.primaryKey) {
      return null;
    }

    // future: maybe support `in`
    if (filter.predicate.type !== 'equal') {
      return null;
    }

    return filter.predicate.value as SID_of<any>;
  }
}
