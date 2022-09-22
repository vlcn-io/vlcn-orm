export type MemoryVersion = number;
let version: MemoryVersion = Number.MIN_SAFE_INTEGER;

export const memory = {
  get version() {
    return version;
  },

  nextVersion() {
    return ++version;
  },
};
