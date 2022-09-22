import { tx } from "../transaction.js";
import { value } from "../Value.js";

test("reading and writing utside of transaction(s)", () => {
  let d = { x: "y" };
  const v = value(d);

  expect(v.get()).toBe(d);

  d = { x: "z" };
  v.set(d);
  expect(v.get()).toBe(d);
});

test("reading and writing within a transaction where nothing is modified", async () => {
  let d = { x: "y" };
  const v = value(d);

  // sync
  tx(() => {
    expect(v.get()).toBe(d);
  });

  // async
  await tx(async () => {
    expect(v.get()).toBe(d);
  });
});

test("Within a transaction where nothing is concurrently modified", async () => {
  // sync
  tx(() => {
    let d = { x: "y" };
    const v = value(d);

    // the value was created within the current tx...
    // should this not mean it was touched by the current tx?
    expect(v.get()).toBe(d);

    d = { x: "z" };
    v.set(d);
    expect(v.get()).toBe(d);
  });

  // cb fn that returns a promise
  await tx(async () => {
    let d = { x: "y" };
    const v = value(d);

    expect(v.get()).toBe(d);

    d = { x: "z" };
    v.set(d);
    expect(v.get()).toBe(d);
  });

  let d = { x: "y" };
  const v = value(d);

  // test when the value exists before entering the tx.
  tx(() => {
    expect(v.get()).toBe(d);

    d = { x: "z" };
    v.set(d);
    expect(v.get()).toBe(d);
  });
});

test("Within a transaction that awaits and is thus suspended", async () => {
  await tx(async () => {
    let d = { x: "y" };
    const v = value(d);

    await new Promise((resolved) => setTimeout(resolved, 0));

    expect(v.get()).toBe(d);

    d = { x: "z" };
    v.set(d);
    await new Promise((resolved) => setTimeout(resolved, 0));

    expect(v.get()).toBe(d);
  });
});

// TODO: how should we handle nested transactions?
// value resolution would be based on touched linked list.
// Inner tx commit would commit to parent rather than "real" dataset.
// Memory version "just works"?
test("Within a transaction with concurrent modifications", async () => {
  const initial = { x: 1 };
  const shared = value(initial);

  const task = () =>
    tx(async () => {
      expect(shared.get()).toBe(initial);

      const newVal = Math.random() * 1000;
      shared.set({ x: newVal });

      expect(shared.get().x).toBe(newVal);

      await new Promise((resolved) => setTimeout(resolved, Math.random() * 25));

      // we should never see updates made by other tasks when inside a tx.
      expect(shared.get().x).toBe(newVal);
    });

  await Promise.all([task(), task(), task(), task(), task()]);
});

test("An aborted tx", async () => {
  const initial = { x: 1 };
  const shared = value(initial);

  let caught = false;
  try {
    tx(() => {
      shared.set({ x: -1 });
      throw new Error("Failed");
    });
  } catch (e) {
    caught = true;
  }
  expect(caught).toBe(true);
  caught = false;

  // failed transactions leave no trace
  expect(shared.get().x).toBe(1);

  try {
    await tx(async () => {
      shared.set({ x: -1 });
      throw new Error("Failed");
    });
  } catch (e) {
    caught = true;
  }
  expect(caught).toBe(true);

  // failed transactions on async functions leave no trace
  expect(shared.get().x).toBe(1);
});

test("effects of a tx are not observable until that tx is committed", async () => {
  const initial = { x: 1 };
  const shared = value(initial);

  const handle = tx(async () => {
    shared.set({ x: 2 });
    await new Promise((resolved) => setTimeout(resolved, 0));
  });

  expect(shared.get().x).toBe(1);

  await handle;

  expect(shared.get().x).toBe(2);
});
