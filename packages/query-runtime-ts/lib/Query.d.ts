import { Expression, HopExpression, SourceExpression } from "./Expression.js";
import HopPlan from "./HopPlan.js";
import Plan, { IPlan } from "./Plan.js";
export interface Query<T> {
    plan(): IPlan;
    gen(): Promise<T[]>;
}
declare abstract class BaseQuery<T> implements Query<T> {
    gen(): Promise<T[]>;
    abstract plan(): IPlan;
}
export declare abstract class SourceQuery<T> extends BaseQuery<T> {
    readonly expression: SourceExpression<T>;
    constructor(expression: SourceExpression<T>);
    plan(): Plan;
}
export declare abstract class HopQuery<TIn, TOut> extends BaseQuery<TOut> {
    #private;
    readonly expression: HopExpression<TIn, TOut>;
    constructor(priorQuery: Query<TIn>, expression: HopExpression<TIn, TOut>);
    plan(): HopPlan;
}
export declare abstract class DerivedQuery<TOut> extends BaseQuery<TOut> {
    #private;
    constructor(priorQuery: Query<any>, expression?: Expression);
    plan(): IPlan;
}
export {};
