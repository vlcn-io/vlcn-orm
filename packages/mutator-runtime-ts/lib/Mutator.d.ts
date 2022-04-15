import { Changeset, CreateChangeset, DeleteChangeset, UpdateChangeset, IModel, ModelSpec } from '@aphro/model-runtime-ts';
export interface IMutationBuilder<T extends Object, M extends IModel<T>> {
    getChangeset(): Changeset<M, T>;
}
declare abstract class MutationBuilder<T extends Object, M extends IModel<T>> implements IMutationBuilder<T, M> {
    protected spec: ModelSpec<T>;
    protected data: Partial<T>;
    constructor(spec: ModelSpec<T>, data: Partial<T>);
    abstract getChangeset(): Changeset<M, T>;
}
export declare abstract class CreationMutationBuilder<T extends Object, M extends IModel<T>> extends MutationBuilder<T, M> {
    constructor(spec: ModelSpec<T>);
    getChangeset(): CreateChangeset<M, T>;
}
export declare abstract class UpdateMutationBuilder<T extends Object, M extends IModel<T>> extends MutationBuilder<T, M> {
    private model;
    constructor(spec: ModelSpec<T>, model: M);
    getChangeset(): UpdateChangeset<M, T>;
}
export declare class DeleteMutationBuilder<T extends Object, M extends IModel<T>> extends MutationBuilder<T, M> {
    private model;
    constructor(spec: ModelSpec<T>, model: M);
    getChangeset(): DeleteChangeset<M, T>;
}
export {};
