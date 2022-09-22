import { Value } from "./Value.js";
export declare class ObservableValue<T> extends Value<T> {
    #private;
    observe(fn: (v: T) => void): () => void;
    __transactionComplete(): void;
}
//# sourceMappingURL=ObservableValue.d.ts.map