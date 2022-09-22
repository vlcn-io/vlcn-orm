import { newScope, PSD } from "../index.js";

test("async/await", async () => {
  let c = 0;
  const task = async () => {
    let prop = ++c;
    const ctx = {
      prop,
    };
    await newScope(async () => {
      // TODO: fix up dexie types to understand psd extension
      // @ts-ignore
      expect(prop).toBe(PSD.prop);

      await new Promise((resolve) => setTimeout(resolve, Math.random() * 50));
      // @ts-ignore
      expect(prop).toBe(PSD.prop);
    }, ctx);
  };

  await Promise.all([task(), task(), task(), task(), task()]);
});

test("promise", () => {
  let c = 0;
  const task = () => {
    let prop = ++c;
    const ctx = {
      prop,
    };
    return newScope(() => {
      // @ts-ignore
      expect(prop).toBe(PSD.prop);

      new Promise((resolve) => setTimeout(resolve, Math.random() * 50)).then(
        () => {
          // @ts-ignore
          expect(prop).toBe(PSD.prop);
        }
      );
    }, ctx);
  };

  return Promise.all([task(), task(), task(), task(), task()]);
});

// dexie doesn't patch setTimeout or other APIs but that's fine -- users shouldn't be spreading a tx out over time via anything other
// than promises and async/await.
// If we do run into a valid use case... we'll figure out how we should patch the required APIs then.
// Note: could we fix OpenTelemetry based on the Dexie approach?
//   - https://github.com/aphrodite-sh/acid-memory/commit/fef0d84765dadd26920fc91bb1ac3ed443c59840
