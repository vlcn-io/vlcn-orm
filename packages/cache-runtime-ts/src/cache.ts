// The cache is to ensure only 1 instance of a given node is ever loaded at once.
// All aspects of the application will always see the exact same version
// of a given node at all times.
//
// Query is returning a node? Return the cached version.
// Genning a node? check the cache.
// Deleting a node? rm from cache
//
// TODO: we should allow cache configuration to control how optimistic updates are handled.
// Changing cache config would then need to change return type of `persist` via mapped types.
//

import { invariant } from '@strut/utils';
import { SID_of } from '@strut/sid';

/**
 * Caching deserves an entire blog post.
 * There are several dimensions to consider with the cache:
 * 1. Is it write through?
 * 2. Is it global?
 * 3. Is it unique per viewer (YES, I think it always must be for privacy sake)
 * 4. If unique per viewer, do we have 2 layers? One layer where the data is and global, the other layer
 *   after privacy rules are applied?
 * 5. Is it bounded? Or just weak reference based?
 * 6. What classes of queries do we _know_ that we can resolve directly from the cache?
 * 7. Do reads re-hydrate the cache or do reads coming back from query layer get tossed out and the cache value returned?
 *   ^-- this depends on if write through or not
 * 8. Related to 7 -- do we fetch _only_ ids first and then, if cache miss, the actual data?
 *   ^-- this seems like a very marginal consideration esp for "db on device" software
 * ---
 * Based on above:
 * 1. how do we ensure cross-viewer data is not ending up in the cache instance?
 * 2. what cache configuration options do we expose
 *   ^-- cache config will be different by use case.
 *   ^-- we should provide templates/defaults for each use case (server, client, 1 user only, collaborative)
 *   ^-- we should also provide a default that can work for all use cases.
 */
export default class Cache {
  readonly #cache = new Map<SID_of<Object>, WeakRef<Object>>();
  #setCount: number = 0;

  constructor() {}

  #gc() {
    this.#setCount = 0;
    // TODO: we can be smarter here if/when the cache becomes massive.
    // E.g., spread the GC over many ticks via chunking.
    for (let [key, ref] of this.#cache.entries()) {
      if (ref.deref == null) {
        this.#cache.delete(key);
      }
    }
  }

  get<T extends Object>(id: SID_of<T>, typename: string): T | null {
    const idconcat = concatId(id, typename);
    const ref = this.#cache.get(idconcat as SID_of<T>);
    if (ref == null) {
      return null;
    }

    const thing = ref.deref();
    if (thing == null) {
      return null;
    }

    return thing as T;
  }

  set<T extends Object>(id: SID_of<T>, node: T): void {
    ++this.#setCount;
    if (this.#setCount > 1000) {
      this.#gc();
    }

    const existing = this.get(id, node.constructor.name);
    if (existing === node) {
      return;
    }
    // This is important given only one instance of an object with a given id should ever exist
    // (well based on privacy constraints -- but cache privacy should be managed up a layer via different cache instances per viewer)
    // If someone has created a new instance then they're invalidating references that exist elsewhere.
    invariant(
      existing == null,
      `Trying to reset something in the cache to a different instance. ID: ${id}, CTOR: ${node.constructor.name}.`,
    );

    const ref = new WeakRef(node);
    this.#cache.set(concatId(id, node.constructor.name), ref);
  }

  remove<T extends Object>(id: SID_of<T>, typename: string): T | null {
    let idconcat = concatId(id, typename);
    const ref = this.#cache.get(idconcat);
    if (ref == null) {
      return null;
    }

    this.#cache.delete(idconcat);

    const thing = ref.deref();
    if (thing == null) {
      return null;
    }

    return thing as T;
  }

  clear() {
    this.#cache.clear();
  }
}

// TODO: this should take into account engine and db too...
// could have duplicative type names. E.g., `User` generated for `Memory` and `SQL` storage.
function concatId<T>(id: SID_of<T>, typename: string) {
  return (id + '-' + typename) as SID_of<T>;
}
