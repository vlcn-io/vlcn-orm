export interface IValue<T> {
    get(): T;
    set(data: T): void;
    __commit(data: T): void;
    __transactionComplete(): void;
}
/**
 * Value is the primitive building block to creating ACI memory. Value can hold anything.
 * If you put complex types into value those types should be immutable.
 */
export declare class Value<T> implements IValue<T> {
    private data;
    private history;
    private memVers;
    constructor(data: T);
    /**
     * Reads the current value. If a transaction is provided this method will return
     * the value as seen through transaction isolation.
     * @param tx
     * @returns
     */
    get(): T;
    /**
     * Sets the value. If a transaction is not provided the value
     * is set and committed. If a transaction is provided, the value is only
     * set from the perspective of that transaction. Once the transaction
     * is committed the value will be visible outside the transaction.
     * @param data
     * @param tx
     * @returns
     */
    set(data: T): void;
    /**
     * Commit the change. Should only be called by
     * transaction logic and not end users.
     */
    __commit(data: T): void;
    __transactionComplete(): void;
}
export declare function value<T>(data: T): IValue<T>;
//# sourceMappingURL=Value.d.ts.map