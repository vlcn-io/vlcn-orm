import { memory } from "../memory.js";

test("current version", () => {
  // idempotent
  expect(memory.version).toBe(memory.version);

  // initialization
  expect(memory.version).toBe(Number.MIN_SAFE_INTEGER);
});

test("next version", () => {
  // next version is persisted
  expect(memory.nextVersion()).toBe(memory.version);

  const lastVersion = memory.version;
  // monotonically increases
  expect(memory.nextVersion()).toBeGreaterThan(lastVersion);
});
