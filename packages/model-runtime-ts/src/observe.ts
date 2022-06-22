export default function observe<T>(initialize: (change: (x: T) => T) => null | (() => void)) {
  let stale = false;
  let value: T;
  let resolve: ((value: T | PromiseLike<T>) => void) | null;
  const dispose = initialize(change);

  function change(x: T) {
    if (resolve) resolve(x), (resolve = null);
    else stale = true;
    return (value = x);
  }

  function next(): { done: false; value: Promise<T> } {
    return {
      done: false,
      value: stale ? ((stale = false), Promise.resolve(value)) : new Promise(_ => (resolve = _)),
    };
  }

  const ret = {
    [Symbol.iterator]: () => ret,
    throw: () => ({ done: true, value }),
    return: () => (dispose != null && dispose(), { done: true, value }),
    next,
  } as const;
  return ret;
}
