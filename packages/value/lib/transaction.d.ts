import { MemoryVersion } from "./memory.js";
import { IValue } from "./Value.js";
export declare const inflight: Transaction[];
export declare type Transaction = {
    readonly touched: Map<IValue<any>, any>;
    readonly memoryVersion: MemoryVersion;
};
export declare function transaction(): Transaction;
export declare function tx<T>(fn: () => T): T;
//# sourceMappingURL=transaction.d.ts.map