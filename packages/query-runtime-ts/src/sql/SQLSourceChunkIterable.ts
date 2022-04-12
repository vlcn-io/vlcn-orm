import { ModelSpec } from '@aphro/model-runtime-ts';
import { BaseChunkIterable } from '../ChunkIterable.js';
import specAndOpsToSQL from './specAndOpsToSQL.js';
import { HoistedOperations } from './SqlSourceExpression.js';

export default class SQLSourceChunkIterable<T> extends BaseChunkIterable<T> {
  private cachedCompilation: ReturnType<typeof compile> | null;
  constructor(private spec: ModelSpec<T>, private hoistedOperations: HoistedOperations) {
    super();
  }

  async *[Symbol.asyncIterator](): AsyncIterator<readonly T[]> {
    const query = this.compileQuery();

    return [];
  }

  __getSQL() {
    return this.compileQuery();
  }

  private compileQuery() {
    if (this.cachedCompilation != null) {
      return this.cachedCompilation;
    }

    this.cachedCompilation = compile(this.spec, this.hoistedOperations);
    return this.cachedCompilation;
  }
}

function compile(spec: ModelSpec<any>, hoistedOperations: HoistedOperations) {
  return specAndOpsToSQL(spec, hoistedOperations).toSQL().toNative();
}
