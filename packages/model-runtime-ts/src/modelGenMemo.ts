import { Context, OptimisticPromise } from '@aphro/context-runtime-ts';
import { SID_of } from '@strut/sid';

/**
 * Memoizes `gen`, `genFoo` type methods where we're loading a model by id.
 *
 * If multiple concurrent access to the method happens, return the promise awaiting to be resolved.
 * If the thing is already cached, returns that.
 *
 * Returns optimstic promises as well.
 *
 * TODO: maybe just get rid of all this optimistic promise crap.
 * Complicates the code and is only a problem because React can't handle async correctly.
 */
export default function modelGenMemo<T>(
  dbname: string,
  tablish: string,
  gen: (ctx: Context, id: SID_of<T>) => OptimisticPromise<T>,
) {
  const priorHandles: Map<string, OptimisticPromise<T>> = new Map();
  return async (ctx: Context, id: SID_of<T>) => {
    const key = ctx.cache.cacheId + '~' + id;
    const priorHandle = priorHandles.get(key);
    if (priorHandle) {
      return priorHandle;
    }
    const existing = ctx.cache.get(id as SID_of<T>, dbname, tablish);
    if (existing != null) {
      const ret = new OptimisticPromise<T>(resolve => resolve(existing));
      ret.__setOptimisticResult(existing);
      return ret;
    }
    const currentHandle = gen(ctx, id);
    priorHandles.set(key, currentHandle);
    currentHandle.finally(() => priorHandles.delete(key));
    return currentHandle;
  };
}
