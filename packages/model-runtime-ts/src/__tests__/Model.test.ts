jest.useFakeTimers();
import Model from "../Model.js";
import { commit } from "../Changeset.js";
import TransactionLog from "../TransactionLog.js";

const testLog = new TransactionLog(5);

class TestModel extends Model<{ thing: number; foo: number }> {
  setThing(v: number) {
    return this.change({
      thing: v,
    });
  }

  setFoo(v: number) {
    return this.change({
      foo: v,
    });
  }
}

it("notifies key specific listeners", () => {
  const m = new TestModel({
    thing: 1,
    foo: 0,
  });

  let notified = false;
  m.subscribeTo(["thing"], () => (notified = true));

  expect(notified).toBe(false);

  commit(m.setThing(2), testLog);
  jest.runAllTimers();

  expect(notified).toBe(true);
});

it("does not double notify the same callback, even if registered against many keys", () => {
  const m = new TestModel({
    thing: 1,
    foo: 0,
  });

  let notified = 0;
  m.subscribeTo(["thing", "foo"], () => (notified += 1));

  expect(notified).toBe(0);

  commit(m.setThing(2), testLog);
  jest.runAllTimers();

  // INTENTIONAL!
  expect(notified).toBe(1);
});

it("does not notify if nothing actually changed", () => {
  const m = new TestModel({
    thing: 1,
    foo: 0,
  });

  let notified = false;
  m.subscribeTo(["thing"], () => (notified = true));

  expect(notified).toBe(false);

  commit(m.setThing(1), testLog);
  jest.runAllTimers();

  expect(notified).toBe(false);
});

it("only notifies specific listener if their specific key changed", () => {
  const m = new TestModel({
    thing: 1,
    foo: 0,
  });

  let notified = false;
  m.subscribeTo(["thing"], () => (notified = true));

  expect(notified).toBe(false);

  commit(m.setFoo(3), testLog);
  jest.runAllTimers();

  expect(notified).toBe(false);
});

it("notifies global listeners", () => {
  const m = new TestModel({
    thing: 1,
    foo: 0,
  });

  let notified = false;
  m.subscribe(() => (notified = true));

  expect(notified).toBe(false);

  commit(m.setFoo(3), testLog);
  jest.runAllTimers();

  expect(notified).toBe(true);
});

it("diposes normal listers", () => {
  const m = new TestModel({
    thing: 1,
    foo: 0,
  });

  let notified = false;
  const disposer = m.subscribe(() => (notified = true));

  expect(notified).toBe(false);
  disposer();

  commit(m.setFoo(3), testLog);
  jest.runAllTimers();
  expect(notified).toBe(false);
});

it("disposes keyed listeners", () => {
  const m = new TestModel({
    thing: 1,
    foo: 0,
  });

  let notified = false;
  const dispoer = m.subscribeTo(["thing"], () => (notified = true));

  expect(notified).toBe(false);
  dispoer();

  commit(m.setThing(2), testLog);
  jest.runAllTimers();
  expect(notified).toBe(false);
});

it("Collapses notifications", () => {
  const m = new TestModel({
    thing: 1,
    foo: 0,
  });

  let notified = 0;
  m.subscribeTo(["thing", "foo"], () => (notified += 1));

  expect(notified).toBe(0);

  commit([m.setThing(2), m.setFoo(3)], testLog);
  jest.runAllTimers();

  expect(notified).toBe(1);
});

// Test we get a single notification even if many
// mods to the same object in a single tick
