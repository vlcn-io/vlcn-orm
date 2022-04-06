import { ChunkIterable } from "./ChunkIterable.js";
import { Expression, SourceExpression } from "./Expression.js";
import HopPlan from "./HopPlan.js";
export interface IPlan {
    get derivations(): readonly Expression[];
    get iterable(): ChunkIterable<any>;
    addDerivation(expression?: Expression): this;
    optimize(nextHop?: HopPlan): IPlan;
}
export default class Plan implements IPlan {
    #private;
    constructor(source: SourceExpression<any>, derivations: Expression[]);
    get derivations(): ReadonlyArray<Expression>;
    get iterable(): ChunkIterable<any>;
    addDerivation(expression?: Expression): this;
    optimize(nextHop?: HopPlan): Plan;
}
