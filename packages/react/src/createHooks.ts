import { Query, Context, UpdateType, INode } from '@aphro/runtime-ts';
import counter from '@strut/counter';
import { useRef, useEffect, useReducer } from 'react';
import { suspend } from 'suspend-react';
import { useLiveResult } from './hooks.js';

const count = counter('model-infra/CreateHooks');

export type ContextPromise = Promise<Context>;

export type UseQueryOptions = {
  // If you want to limit what sorts of updates will cause the live query to re-fire
  on?: UpdateType;
  // Required to cache the results of a query
  // This allows components to unmount and remount without losing previously queried state.
  // Should we just compute the key for them?
  // We can given the declarative nature of the queries...
  key: string;
  // a list of dependencies for the query creator function. if these change,
  // the query will be re-run.
  deps?: any[];
};

type QueryReturnType<Q> = Q extends Query<infer M> ? M : any;

export function createHooks(contextPromise: ContextPromise) {
  // suspends the subtree using a hook that depends on context initialization
  // until the context has been initialized.
  function suspendOnContext() {
    return suspend(() => {
      return contextPromise;
    }, ['context']);
  }

  function useQueryContext() {
    const ctx = suspendOnContext();
    return ctx;
  }

  function useQuery<Q extends Query<QueryReturnType<Q>>>(
    queryProvider: (ctx: Context) => Q,
    { on, key, deps = [] }: UseQueryOptions,
  ) {
    const ctx = useQueryContext();

    // suspend on the first result to skip 'pending' state and always work
    // with either fresh or stale resolved data. suspended value will be cached
    // according to user-supplied key which is required
    // TODO: generate cache key from query
    const liveRef = useRef<any>();
    const liveResult = suspend(async () => {
      count.bump('suspend.liveResult.initial');
      const q = queryProvider(ctx);
      const liveResult = q.live(on || UpdateType.ANY);
      // Keep a ref to `liveResult` since `liveResult` weakly subscribes to data sources.
      liveRef.current = liveResult;
      await liveResult.__currentHandle;
      return liveResult;
    }, [key, ...deps]);

    return useLiveResult(liveResult);
  }

  function useQueryOne<ResultType>(
    queryProvider: (ctx: Context) => Query<ResultType>,
    { on, key, deps }: UseQueryOptions,
  ) {
    const result = useQuery(queryProvider, { on, key, deps });
    return result[0];
  }

  function useBind<Node extends INode<Shape>, Shape extends {}>(
    node: Node,
    keys?: (keyof Shape)[],
  ) {
    count.bump('useBind.' + node.constructor.name);
    const [tick, forceUpdate] = useReducer(x => x + 1, 0);
    useEffect(() => {
      if (keys != null) {
        count.bump('keyed.subscription.' + node.constructor.name);
        // subscribe returns a function which will dispose of the subscription
        return node.subscribeTo(keys, () => forceUpdate());
      } else {
        // subscribe returns a function which will dispose of the subscription
        return node.subscribe(() => forceUpdate());
      }
    }, [node]);
  }

  return {
    useQuery,
    useQueryOne,
    useBind,
  };
}
