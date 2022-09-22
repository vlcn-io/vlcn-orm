import { MemoryVersion } from "./memory.js";
export declare class History<T> {
    private nodes;
    at(memVers: MemoryVersion): T;
    maybeAdd(data: T, memoryVersion: MemoryVersion): void;
    drop(): void;
}
//# sourceMappingURL=History.d.ts.map