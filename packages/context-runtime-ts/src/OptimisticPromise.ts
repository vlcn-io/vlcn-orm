/* TODO: maybe just get rid of all this optimistic promise crap.
 * Complicates the code and is only a problem because React can't handle async correctly.
 */
export default class OptimisticPromise<T> extends Promise<T> {
  // @ts-ignore
  #optimistic: T;

  get optimistic(): T {
    return this.#optimistic;
  }

  __setOptimisticResult(r: T): void {
    this.#optimistic = r;
  }
}
