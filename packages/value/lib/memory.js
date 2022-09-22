let version = Number.MIN_SAFE_INTEGER;
export const memory = {
    get version() {
        return version;
    },
    nextVersion() {
        return ++version;
    },
};
//# sourceMappingURL=memory.js.map