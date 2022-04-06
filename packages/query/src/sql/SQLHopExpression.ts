import { SID_of } from "@strut/sid";
import { ChunkIterable } from "query/ChunkIterable";
import { HopExpression } from "query/Expression";
import HopPlan from "query/HopPlan";

export default class SQLHopExpression<T>
  implements HopExpression<SID_of<any>, T>
{
  chainAfter(iterable: ChunkIterable<SID_of<any>>): ChunkIterable<T> {
    throw new Error("unimplemented");
  }
  /**
   * Optimizes the current plan (plan) and folds in the nxet hop (nextHop) if possible.
   */
  optimize(plan: HopPlan, nextHop?: HopPlan): HopPlan {
    throw new Error("unimplemented");
  }

  type: "hop" = "hop";
}
