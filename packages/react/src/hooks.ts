// TODO: this should be in a separate package from the core model code.
import { useEffect, useReducer, useRef, useState } from 'react';
import { INode, Query, UpdateType, LiveResult } from '@aphro/runtime-ts';
import counter from '@strut/counter';

const count = counter('model-infra/Hooks');

export function useBind<M extends INode<D>, D extends {}>(m: M): void;
export function useBind<M extends INode<D>, D extends {}>(m: M, keys: (keyof D)[]): void;

/**
 * @deprecated - use createHooks instead
 */
export function useBind<M extends INode<D>, D extends {}>(m: M, keys?: (keyof D)[]): void {
  count.bump('useBind.' + m.constructor.name);
  const [tick, forceUpdate] = useReducer(x => x + 1, 0);
  useEffect(() => {
    if (keys != null) {
      count.bump('keyed.subscription.' + m.constructor.name);
      // subscribe returns a function which will dispose of the subscription
      return m.subscribeTo(keys, () => forceUpdate());
    } else {
      // subscribe returns a function which will dispose of the subscription
      return m.subscribe(() => forceUpdate());
    }
  }, [m]);
}

export type UseQueryData<T> = {
  loading: boolean;
  error?: Error;
  data: T[];
};
type QueryReturnType<Q> = Q extends Query<infer M> ? M : any;

export function useLiveResult<T>(result: LiveResult<T>) {
  const [data, setData] = useState<T[]>(result.latest || []);
  useEffect(() => {
    let isMounted = true;
    const disposer = result.subscribe(newData => {
      if (!isMounted) {
        return;
      }

      setData(newData);
    });
    return () => {
      isMounted = false;
      disposer();
    };
  }, [result]);

  return data;
}

export type UseQueryOptions = {
  // If you want to limit what sorts of updates will cause the live query to re-fire
  on?: UpdateType;
  // If you want to cache the results of the query.
  // This'll allow components to unmount and remount without losing previously queried state.
  // Should we just compute the key for them?
  // We can given the declarative nature of the queries...
  key?: string;
};
/**
 * @deprecated - use createHooks instead
 */
export function useQuery<Q extends Query<QueryReturnType<Q>>>(
  queryProvider: () => Q,
  deps: any[] = [],
  { on, key }: UseQueryOptions = {},
): UseQueryData<QueryReturnType<Q>> {
  const currentLiveResult = useRef<LiveResult<QueryReturnType<Q>> | null>(null);
  let [result, setResult] = useState<UseQueryData<QueryReturnType<Q>>>(() => {
    let result: UseQueryData<QueryReturnType<Q>> = {
      loading: true,
      data: [],
    };
    if (key != null) {
      const cached = cache.get(key);
      if (cached != null) {
        result = {
          // We set loading to true given the cached
          // value can be stale.
          // Note: we can make futher refinements to `LiveResult` where the cached
          // value would not be stale. E.g., applying expressions of the live result
          // to all creates, deletes and modifications of nodes
          // and adding or rejecting them to the live result based on the result
          // of the expressions.
          //
          // caveats exists here where joins or multi-hops cannot be done in this way
          // since the traversed-through nodes are not in application memory
          loading: true,
          data: cached,
        };
      }
    }
    return result;
  });

  useEffect(() => {
    count.bump('useQuery.useEffect');
    const q = queryProvider();
    const liveResult = q.live(on || UpdateType.ANY);
    currentLiveResult.current = liveResult;
    liveResult.subscribe((data: QueryReturnType<Q>[]) => {
      // this can mismatch if this is an old subscriber from a prior run
      // of `useEffect`. Theoretically this should not happen.
      if (liveResult !== currentLiveResult.current) {
        count.bump('liveresult!==currentLiveResult');
        return;
      }

      setResult({
        loading: false,
        data,
      });
      if (key != null) {
        cache.set(key, data);
      }
    });

    // has data from a prior run?
    if (liveResult.latest != null) {
      result = {
        loading: true,
        data: liveResult.latest,
      };
      setResult(result);
    }

    return () => liveResult.free();
  }, deps);

  return result;
}

// exported for testing. Not exported from the package (index.ts), however.
export class QueryCache {
  #map: Map<string, any[]> = new Map();
  #maxSize: number;

  constructor(maxSize: number) {
    this.#maxSize = maxSize;
  }

  set(key: string, data: any[]): void {
    if (this.#map.size >= this.#maxSize) {
      const rmKey = this.#map.keys().next().value;
      this.#map.delete(rmKey);
    }

    this.#map.set(key, data);
  }

  get(key: string): any[] | undefined {
    return this.#map.get(key);
  }

  get size() {
    return this.#map.size;
  }
}

const cache = new QueryCache(100);

// export function useQuerySuspense<Q extends Query<QueryReturnType<Q>>>(
//   queryProvider: () => Q,
//   deps: any[],
//   on: UpdateType = UpdateType.ANY,
// ): QueryReturnType<Q>[] {
//   const data = useQueryVerbose(queryProvider, deps, on);
//   if (data.status === 'error') {
//     throw data.error;
//   }

//   // TODO: Make this suspense friendly?
//   if (data.status === 'loading') {
//     throw 'loading';
//   }

//   return data.data;
// }
