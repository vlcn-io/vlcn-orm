import { Spec } from '@aphro/model-runtime-ts';
import { BaseChunkIterable } from '../ChunkIterable.js';
import { HoistedOperations } from './SqlSourceExpression.js';
export default class SQLSourceChunkIterable<T> extends BaseChunkIterable<T> {
    constructor(spec: Spec<T>, hoistedOperations: HoistedOperations);
    [Symbol.asyncIterator](): AsyncIterator<readonly T[]>;
}
