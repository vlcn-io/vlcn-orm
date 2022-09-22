export default function DexiePromise(fn: any, ...args: any[]): void;
export default class DexiePromise {
    constructor(fn: any, ...args: any[]);
    _listeners: any[];
    onuncatched: typeof nop;
    _lib: boolean;
    _PSD: {
        id: string;
        global: boolean;
        ref: number;
        unhandleds: never[];
        onunhandled: typeof globalError;
        pgp: boolean;
        env: {};
        finalize: () => void;
    };
    _stackHolder: unknown;
    _prev: any;
    _numPrev: number | undefined;
    _state: any;
    _value: any;
}
export function beginMicroTickScope(): boolean;
export function endMicroTickScope(): void;
export function wrap(fn: any, errorCatcher: any): (...args: any[]) => any;
export function newScope(fn: any, props: any, a1: any, a2: any): any;
export function incrementExpectedAwaits(): number;
export function decrementExpectedAwaits(): boolean;
export function onPossibleParallellAsync(possiblePromise: any): any;
export function usePSD(psd: any, fn: any, a1: any, a2: any, a3: any): any;
export const NativePromise: Function | undefined;
export namespace globalPSD {
    const env: {
        Promise: any;
        PromiseProp: PropertyDescriptor | undefined;
        all: any;
        race: any;
        allSettled: any;
        any: any;
        resolve: any;
        reject: any;
        nthen: any;
        gthen: any;
    } | {
        Promise?: undefined;
        PromiseProp?: undefined;
        all?: undefined;
        race?: undefined;
        allSettled?: undefined;
        any?: undefined;
        resolve?: undefined;
        reject?: undefined;
        nthen?: undefined;
        gthen?: undefined;
    };
}
export namespace PSD {
    export const id: string;
    export const global: boolean;
    export const ref: number;
    export const unhandleds: never[];
    export { globalError as onunhandled };
    export const pgp: boolean;
    const env_1: {};
    export { env_1 as env };
    export function finalize(): void;
}
export const microtickQueue: any[];
export const numScheduledCalls: number;
export const tickFinalizers: any[];
export const rejection: any;
import { nop } from "../functions/chaining-functions";
declare function globalError(err: any, promise: any): void;
export {};
//# sourceMappingURL=promise.d.ts.map