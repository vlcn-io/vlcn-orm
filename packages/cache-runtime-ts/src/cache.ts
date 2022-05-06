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

const cache = new Map<SID_of<IModel<Object>>, WeakRef<IModel<Object>>>();

function get<T extends IModel<Object>>(id: SID_of<T>): T | null {
  const ref = cache.get(id);
  if (ref == null) {
    return null;
  }

  const thing = ref.deref();
  if (thing == null) {
    return null;
  }

  return thing as T;
}

function set<T extends IModel<Object>>(id: SID_of<T>, node: T): void {
  const existing = get(id);
  invariant(existing == null, 'Trying to set something in the cache which is already in the cache');

  const ref = new WeakRef(node);
  cache.set(id, ref);
}

function remove<T extends IModel<Object>>(id: SID_of<T>): T | null {
  const ref = cache.get(id);
  if (ref == null) {
    return null;
  }

  cache.delete(id);

  const thing = ref.deref();
  if (thing == null) {
    return null;
  }

  return thing as T;
}

// TODO: we can be smarter here if/when the cache becomes massive.
// E.g., spread the GC over many ticks via chunking.
const intervalHandle = setInterval(() => {
  for (let [key, ref] of cache.entries()) {
    if (ref.deref == null) {
      cache.delete(key);
    }
  }
}, 1000);

export default {
  get,
  set,
  remove,
  clear() {
    cache.clear();
  },
  destroy() {
    cache.clear();
    clearInterval(intervalHandle);
  },
};
