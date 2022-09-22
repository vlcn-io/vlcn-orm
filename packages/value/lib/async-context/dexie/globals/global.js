export const _global = typeof globalThis !== "undefined"
    ? globalThis
    : typeof self !== "undefined"
        ? self
        : typeof window !== "undefined"
            ? window
            : global;
//# sourceMappingURL=global.js.map