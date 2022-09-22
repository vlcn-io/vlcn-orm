import { _global } from "../globals/global.js";
export declare const keys: {
    (o: object): string[];
    (o: {}): string[];
};
export declare const isArray: (arg: any) => arg is any[];
export { _global };
export declare function extend<T extends object, X extends object>(obj: T, extension: X): T & X;
export declare const getProto: (o: any) => any;
export declare const _hasOwn: (v: PropertyKey) => boolean;
export declare function hasOwn(obj: any, prop: any): boolean;
export declare function props(proto: any, extension: any): void;
export declare const defineProperty: <T>(o: T, p: PropertyKey, attributes: PropertyDescriptor & ThisType<any>) => T;
export declare function setProp(obj: any, prop: any, functionOrGetSet: any, options?: any): void;
export declare function derive(Child: any): {
    from: (Parent: any) => {
        extend: (extension: any) => void;
    };
};
export declare const getOwnPropertyDescriptor: (o: any, p: PropertyKey) => PropertyDescriptor | undefined;
export declare function getPropertyDescriptor(obj: any, prop: any): any;
export declare function slice(args: any, start?: any, end?: any): never[];
export declare function override(origFunc: any, overridedFactory: any): any;
export declare function assert(b: any): void;
export declare function asap(fn: any): void;
export declare function getUniqueArray(a: any): any;
/** Generate an object (hash map) based on given array.
 * @param extractor Function taking an array item and its index and returning an array of 2 items ([key, value]) to
 *        instert on the resulting object for each item in the array. If this function returns a falsy value, the
 *        current item wont affect the resulting object.
 */
export declare function arrayToObject<T, R>(array: T[], extractor: (x: T, idx: number) => [string, R]): {
    [name: string]: R;
};
export declare function trycatcher(fn: any, reject: any): () => void;
export declare function tryCatch(fn: (...args: any[]) => void, onerror: any, args?: any): void;
export declare function getByKeyPath(obj: any, keyPath: any): any;
export declare function setByKeyPath(obj: any, keyPath: any, value: any): void;
export declare function delByKeyPath(obj: any, keyPath: any): void;
export declare function shallowClone(obj: any): {};
export declare function flatten<T>(a: (T | T[])[]): T[];
export declare const intrinsicTypeNameSet: {
    [name: string]: boolean;
};
export declare function deepClone<T>(any: T): T;
export declare function toStringTag(o: Object): string;
export declare const iteratorSymbol: string | typeof Symbol.iterator;
export declare const getIteratorOf: (x: any) => any;
export declare const asyncIteratorSymbol: string | typeof Symbol.asyncIterator;
export declare const NO_CHAR_ARRAY: {};
export declare function getArrayOf(arrayLike: any): any[];
export declare const isAsyncFunction: (fn: Function) => boolean;
//# sourceMappingURL=utils.d.ts.map