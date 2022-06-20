// TODO: this should be in a separate package from the core model code.
import { useEffect, useReducer, useRef, useState } from 'react';
import { INode, Query, UpdateType, LiveResult } from '@aphro/runtime-ts';
import counter from '@strut/counter';

const count = counter('model-infra/Hooks');

export function useBind<M extends INode<D>, D>(m: M): void;
export function useBind<M extends INode<D>, D>(m: M, keys: (keyof D)[]): void;

export function useBind<M extends INode<D>, D>(m: M, keys?: (keyof D)[]): void {
  count.bump('useBind.' + m.constructor.name);
  // TODO swap out to reac18 "useSyncExternalStore"
  // https://reactjs.org/docs/hooks-reference.html#usesyncexternalstore
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

export type UseQueryData<T> =
  | {
      status: 'loading';
    }
  | {
      status: 'ready';
      data: T[];
    }
  | {
      status: 'error';
      error: Error;
    };

type QueryReturnType<Q> = Q extends Query<infer M> ? M : any;

export function useQuery<Q extends Query<QueryReturnType<Q>>>(
  on: UpdateType,
  queryProvider: () => Q,
  deps: any[],
): UseQueryData<QueryReturnType<Q>> {
  const currentLiveResult = useRef<LiveResult<QueryReturnType<Q>> | null>(null);
  const [result, setResult] = useState<UseQueryData<QueryReturnType<Q>>>({
    status: 'loading',
  });

  useEffect(() => {
    count.bump('useQuery.useEffect');
    const q = queryProvider();
    const liveResult = q.live(on);
    currentLiveResult.current = liveResult;
    liveResult.subscribe((data: QueryReturnType<Q>[]) => {
      // this can mismatch if this is an old subscriber from a prior run
      // of `useEffect`. Theoretically this should not happen.
      if (liveResult !== currentLiveResult.current) {
        count.bump('liveresult!==currentLiveResult');
        return;
      }

      setResult({
        status: 'ready',
        data,
      });
    });

    return () => liveResult.free();
  }, deps);

  return result;
}
