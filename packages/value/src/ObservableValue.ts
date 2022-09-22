// A value that provides hooks into its life cycle (pre-commit, commit) so we can
// build triggers and observers.
// Triggers being run pre-commit
// Observers being run post-commit
import { Value } from "./Value.js";

export class ObservableValue<T> extends Value<T> {
  #observers: Set<(v: T) => void> = new Set();

  observe(fn: (v: T) => void): () => void {
    this.#observers.add(fn);
    return () => this.#observers.delete(fn);
  }

  __transactionComplete() {
    this.#notifyObservers();
  }

  #notifyObservers() {
    for (const o of this.#observers) {
      try {
        o(this.get());
      } catch (e) {
        console.error(e);
      }
    }
  }
}
