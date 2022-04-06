import { ChunkIterable } from "./ChunkIterable.js";
import { Expression, HopExpression } from "./Expression.js";
import { IPlan } from "./Plan.js";
export default class HopPlan implements IPlan {
    #private;
    readonly hop: HopExpression<any, any>;
    constructor(sourcePlan: IPlan, hop: HopExpression<any, any>, derivations: Expression[]);
    get derivations(): ReadonlyArray<Expression>;
    get iterable(): ChunkIterable<any>;
    addDerivation(expression?: Expression): this;
    /**
     * Queries are built up into a reverse linked list.
     * The last query is what the user executes.
     * This last query will optimize from the end back on down.
     */
    optimize(nextHop?: HopPlan): IPlan;
}
