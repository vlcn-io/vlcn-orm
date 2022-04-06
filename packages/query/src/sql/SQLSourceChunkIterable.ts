import { Spec } from "../../Model.js";
import { BaseChunkIterable } from "../ChunkIterable.js";
import { HoistedOperations } from "./SqlSourceExpression.js";

export default class SQLSourceChunkIterable<T> extends BaseChunkIterable<T> {
  constructor(spec: Spec<T>, hoistedOperations: HoistedOperations) {
    super();
  }

  async *[Symbol.asyncIterator](): AsyncIterator<readonly T[]> {
    // now take our hoisted operations and craft the SQL query we need.
  }
}
