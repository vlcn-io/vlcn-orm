import { Query, Context, UpdateType, INode, LiveResult } from '@aphro/runtime-ts';
import counter from '@strut/counter';
import { useCallback, useMemo, useRef, useSyncExternalStore } from 'react';
import { suspend } from 'suspend-react';

const count = counter('model-infra/CreateHooks');

export type ContextPromise = Promise<Context>;

export type UseQueryOptions = {
  // If you want to limit what sorts of updates will cause the live query to re-fire
  on?: UpdateType;
  // If you want to cache the results of the query.
  // This'll allow components to unmount and remount without losing previously queried state.
  // Should we just compute the key for them?
  // We can given the declarative nature of the queries...
  key: string;
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
    deps: any[],
    { on, key }: UseQueryOptions,
  ) {
    const ctx = useQueryContext();

    // allow non-stable query provider functions without rerunning dependent effects -
    // dependencies are manually managed by the deps array parameter.
    const providerRef = useRef(queryProvider);
    providerRef.current = queryProvider;
    const stableProvider = useCallback((ctx: Context) => providerRef.current(ctx), deps);

    // suspend on the first result to skip 'pending' state and always work
    // with either fresh or stale resolved data. suspended value will be cached
    // according to user-supplied key which is required
    // TODO: generate cache key from query
    const liveResult = suspend(async () => {
      count.bump('suspend.liveResult.initial');
      const q = stableProvider(ctx);
      const liveResult = q.live(on || UpdateType.ANY);
      await liveResult.__currentHandle;
      return liveResult;
    }, [key]);

    const latestResult = useSyncExternalStore(
      cb => {
        liveResult.subscribe(cb);
        // FIXME: oof - need to wait til next frame to unsubscribe
        // or the LiveResult will dispose itself.
        return () => {
          requestAnimationFrame(() => {
            liveResult.unsubscribe(cb);
          });
        };
      },
      // asserting that latest is defined here because the suspense
      // above should ensure this.
      () => {
        count.bump('liveResult.subscribe');
        return liveResult.latest!;
      },
    );

    return latestResult;
  }

  function useQueryOne<ResultType>(
    queryProvider: (ctx: Context) => Query<ResultType>,
    deps: any[],
    { on, key }: UseQueryOptions,
  ) {
    const result = useQuery(queryProvider, deps, { on, key });
    return result[0];
  }

  function useBind<Node extends INode<Shape>, Shape>(node: Node, keys?: (keyof Shape)[]) {
    const ctx = useQueryContext();
    const latestResult = useSyncExternalStore(
      cb => {
        if (keys) {
          count.bump('keyed.subcription.' + node.constructor.name);
          return node.subscribeTo(keys, cb);
        } else {
          return node.subscribe(cb);
        }
      },
      // works because this is not referentially stable across updates -
      // the snapshot must always return a different object after each
      // change.
      node._d.bind(node),
    );
    return latestResult;
  }

  return {
    useQuery,
    useQueryOne,
    useBind,
  };
}
