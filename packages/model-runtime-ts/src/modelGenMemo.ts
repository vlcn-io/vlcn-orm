import { Context, OptimisticPromise } from '@aphro/context-runtime-ts';
import { SID_of } from '@strut/sid';

/**
 * Memoizes `gen`, `genFoo` type methods where we're loading a model by id.
 *
 * If multiple concurrent access to the method happens, return the promise awaiting to be resolved.
 * If the thing is already cached, returns that.
 *
 * TODO: can we move this deeper into the query layer itself?
 */
export default function modelGenMemo<T>(
  dbname: string,
  tablish: string,
  gen: (ctx: Context, id: SID_of<T>) => Promise<T>,
) {
  const priorHandles: Map<string, Promise<T>> = new Map();
  return async (ctx: Context, id: SID_of<T>) => {
    const key = ctx.cache.cacheId + '~' + id;
    const priorHandle = priorHandles.get(key);
    if (priorHandle) {
      return priorHandle;
    }
    const existing = ctx.cache.get(id as SID_of<T>, dbname, tablish);
    if (existing != null) {
      return existing;
    }
    const currentHandle = gen(ctx, id);
    priorHandles.set(key, currentHandle);
    currentHandle.finally(() => priorHandles.delete(key));
    return currentHandle;
  };
}
