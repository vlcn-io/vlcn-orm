export default class OptimisticPromise<T> extends Promise<T> {
  #optimistic: T;

  get optimistic(): T {
    return this.#optimistic;
  }

  __setOptimisticResult(r: T): void {
    this.#optimistic = r;
  }
}
