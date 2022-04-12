import { ModelSpec } from '@aphro/model-runtime-ts';
import { BaseChunkIterable } from '../ChunkIterable.js';
import specAndOpsToSQL from './specAndOpsToSQL.js';
import { HoistedOperations } from './SqlSourceExpression.js';

export default class SQLSourceChunkIterable<T> extends BaseChunkIterable<T> {
  constructor(private spec: ModelSpec<T>, private hoistedOperations: HoistedOperations) {
    super();
  }

  async *[Symbol.asyncIterator](): AsyncIterator<readonly T[]> {
    // now take our hoisted operations and craft the SQL query we need.
    const query = specAndOpsToSQL(this.spec, this.hoistedOperations);
    console.log(query.toSQL().toNative());

    return [];
  }
}
