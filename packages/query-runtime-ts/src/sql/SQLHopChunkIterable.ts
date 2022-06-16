/**
 * SQLHopChunkIterable is needed to correctly handle an input source of ids to the query.
 * Basically like SQLSourceChunkIterable except "specAndOpsToQuery" would receive a set of source ids
 * from which the hop starts.
 *
 * HopChunkIterables are only used when a hop could not be rolled into a source expression.
 * As such, the hop chunk iterable receives a set of ids that represent the set of nodes being hopped to.
 *
 * What does this look like?
 * - Field edges
 *  - IDs contained in the fields are provided to the hop iterable
 *    - `where B.id IN (_input ids_)`
 * - FK edges
 *  - IDs of the prior nodes are provided to the hop iterable which then crafts a
 *   - `where B.fk IN (_input ids_)`
 * - Followed Jx edges
 *   - ID2s provided
 * - Non followed jx edges
 *   - ID1s provided...... this means the hop iterable output is an edge?
 * - Inverse jx edges
 * - Non followed inverse jx edges
 */

import { Context } from '@aphro/context-runtime-ts';
import { EdgeSpec } from '@aphro/schema-api';
import { BaseChunkIterable } from '../ChunkIterable.js';
import { HoistedOperations } from './SQLExpression.js';

export default class SQLHopChunkIterable<T> extends BaseChunkIterable<T> {
  constructor(private ctx: Context, private edge: EdgeSpec, private ops: HoistedOperations) {
    super();
  }

  async *[Symbol.asyncIterator](): AsyncIterator<readonly T[]> {
    throw new Error(
      'Unimplemented -- see comments at the top of this file for implementation path',
    );
    // yield await specAndOpsToQuery();
  }
}
