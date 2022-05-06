// The cache is to ensure only 1 instance of a given node is ever loaded at once.
// All aspects of the application will always see the exact same version
// of a given node at all times.
//
// Query is returning a node? Return the cached version.
// Genning a node? check the cache.
// Deleting a node? rm from cache
//
//

import { invariant } from '@strut/utils';
import { SID_of } from '@strut/sid';

import { IModel } from '@aphro/model-runtime-ts';

/**
 * Cache as a class that people can construct, rather than a single global, so
 * processes can make it only alive per-request if that is their desire.
 *
 * Rich clients would keep their cache alive for the duration of the client session. I.e., from application
 * open to application close.
 */
export default class Cache {
  readonly #cache = new Map<SID_of<IModel<Object>>, WeakRef<IModel<Object>>>();
  #intervalHandle: number;

  constructor() {
    // TODO: we can be smarter here if/when the cache becomes massive.
    // E.g., spread the GC over many ticks via chunking.
    this.#intervalHandle = setInterval(() => {
      for (let [key, ref] of this.#cache.entries()) {
        if (ref.deref == null) {
          this.#cache.delete(key);
        }
      }
    }, 1000);
  }

  get<T extends IModel<Object>>(id: SID_of<T>): T | null {
    const ref = this.#cache.get(id);
    if (ref == null) {
      return null;
    }

    const thing = ref.deref();
    if (thing == null) {
      return null;
    }

    return thing as T;
  }

  set<T extends IModel<Object>>(id: SID_of<T>, node: T): void {
    const existing = this.get(id);
    // This is important given only one instance of an object with a given id should ever exist
    // If someone has created a new instance then they're invalidating references that exist elsewhere.
    invariant(
      existing == null,
      'Trying to set something in the cache which is already in the cache',
    );

    const ref = new WeakRef(node);
    this.#cache.set(id, ref);
  }

  remove<T extends IModel<Object>>(id: SID_of<T>): T | null {
    const ref = this.#cache.get(id);
    if (ref == null) {
      return null;
    }

    this.#cache.delete(id);

    const thing = ref.deref();
    if (thing == null) {
      return null;
    }

    return thing as T;
  }

  destruct() {
    this.#cache.clear();
    clearInterval(this.#intervalHandle);
  }
}

// export default {
//   get,
//   set,
//   remove,
//   clear() {
//     cache.clear();
//   },
//   destroy() {
//     cache.clear();
//     clearInterval(intervalHandle);
//   },
// };
