import Plan from './Plan.js';
import { ChunkIterable } from './ChunkIterable.js';
import { Predicate } from './Predicate.js';
import { FieldGetter } from './Field.js';
import HopPlan from './HopPlan.js';
import ModelLoadExpression from './ModelLoadExpression.js';
import { IModel } from '@aphro/model-runtime-ts';
export declare type ExpressionType = 'take' | 'before' | 'after' | 'filter' | 'orderBy' | 'hop' | 'modelLoad';
export declare type Direction = 'asc' | 'dec';
export declare type Expression = ReturnType<typeof take> | ReturnType<typeof before> | ReturnType<typeof after> | ReturnType<typeof filter> | ReturnType<typeof orderBy> | ReturnType<typeof hop> | ReturnType<typeof modelLoad>;
export declare function take<T>(num: number): {
    type: 'take';
    num: number;
} & DerivedExpression<T, T>;
export declare function before<T>(cursor: string): {
    type: 'before';
    cursor: string;
} & DerivedExpression<T, T>;
export declare function after<T>(cursor: string): {
    type: 'after';
    cursor: string;
} & DerivedExpression<T, T>;
export declare function filter<Tm, Tv>(getter: FieldGetter<Tm, Tv>, predicate: Predicate<Tv>): {
    type: 'filter';
    getter: FieldGetter<Tm, Tv>;
    predicate: Predicate<Tv>;
} & DerivedExpression<Tm, Tm>;
export declare function orderBy<Tm, Tv>(getter: FieldGetter<Tm, Tv>, direction: Direction): {
    type: 'orderBy';
} & DerivedExpression<Tm, Tm>;
export declare function hop<TIn, TOut>(): HopExpression<TIn, TOut>;
export declare function modelLoad<TData, TModel extends IModel<TData>>(factory: (TData: any) => TModel): ModelLoadExpression<TData, TModel>;
export interface SourceExpression<TOut> {
    readonly iterable: ChunkIterable<TOut>;
    optimize(plan: Plan, nextHop?: HopPlan): Plan;
}
export interface DerivedExpression<TIn, TOut> {
    chainAfter(iterable: ChunkIterable<TIn>): ChunkIterable<TOut>;
    type: ExpressionType;
}
export interface HopExpression<TIn, TOut> {
    chainAfter(iterable: ChunkIterable<TIn>): ChunkIterable<TOut>;
    /**
     * Optimizes the current plan (plan) and folds in the nxet hop (nextHop) if possible.
     */
    optimize(plan: HopPlan, nextHop?: HopPlan): HopPlan;
    type: 'hop';
}
