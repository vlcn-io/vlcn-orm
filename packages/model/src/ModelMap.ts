/*
If model has id... take that in.

Need to check for presence of id.

Require all models to have ids? We could just generate ones...
*/

import { SID_of } from "@strut/sid";
import { IModel, isHasId } from "./Model.js";

/**
 * ModelMap will key based on id (if present) otherwise based on object identity.
 *
 * This allows persisted models to be deleted without ever actually loading them.
 *
 * Model reference equality works as we never make a new copy of a model.
 * This might sound crazy -- that the same model is always mutated --
 * but model mutation happens in atomic snapshots.
 *
 * This more accurately reflects reality where a thing is consistent in name
 * over time while being a different instance from moment to moment.
 *
 * Models retain named continuity. The Amazon river is the Amazon river by name through time.
 *
 * This history of its particulate manifestations exist but at a different level
 * of abstraction. These can be retrieved through our transaction log system and
 * a model rolled back to a prior time.
 *
 * Functional programming is getting it backwards by not allowing a thing
 * to be consistent by name. We allow this while still allowing atomic versions of the
 * thing to be retrieved via transaction logs -- and the interdependent state of the universe
 * to be rolled back through those same logs.
 */
export default class ModelMap<K extends IModel<any>, V> {
  private internalMap: Map<SID_of<any> | K, [K, V]> = new Map();

  set(key: K, value: V) {
    this.internalMap.set(this.getDelegateKey(key), [key, value]);
  }

  get(key: K): V | undefined {
    const entry = this.internalMap.get(this.getDelegateKey(key));
    return entry && entry[1];
  }

  delete(key: K) {
    this.internalMap.delete(this.getDelegateKey(key));
  }

  private getDelegateKey(key: K): K | SID_of<any> {
    if (isHasId(key)) {
      return key.id;
    }

    return key;
  }

  [Symbol.iterator]() {
    const entries = this.internalMap.entries();

    return {
      next() {
        const n = entries.next();
        if (n.done) {
          return n;
        }

        return {
          value: n.value[1],
        };
      },
    };
  }
}
