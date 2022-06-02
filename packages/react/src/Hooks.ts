// TODO: this should be in a separate package from the core model code.
import { useEffect, useReducer, useRef, useState } from 'react';
import { IModel, Query } from '@aphro/runtime-ts';
import counter from '@strut/counter';

const count = counter('model-infra/Hooks');

export function useBind<M extends IModel<D>, D>(m: M): void;
export function useBind<M extends IModel<D>, D>(m: M, keys: (keyof D)[]): void;

export function useBind<M extends IModel<D>, D>(m: M, keys?: (keyof D)[]): void {
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

type UseQueryData<T> =
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

export function useQuery<M extends IModel, Q extends Query<M>>(
  queryProvider: () => Q,
  deps: any[],
): void {
  const currentLiveResult = useRef();
  const [result, setResult] = useState<UseQueryData<M>>({
    status: 'loading',
  });

  useEffect(() => {
    const q = queryProvider();
    const liveResult = q.live();
    currentLiveResult.current = liveResult;
    // returns a disposer
    return q.live().subscribe((data: M[]) => {
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
  }, deps);

  return result;
}
