export declare var debug: boolean;
export declare function setDebug(value: any, filter: any): void;
export declare var libraryFilter: () => boolean;
export declare const NEEDS_THROW_FOR_STACK: boolean;
export declare function getErrorWithStack(): unknown;
export declare function prettyStack(exception: any, numIgnoredFrames: any): any;
export declare function deprecated<T>(what: string, fn: (...args: any[]) => T): (...args: any[]) => T;
//# sourceMappingURL=debug.d.ts.map