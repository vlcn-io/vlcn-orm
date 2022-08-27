import { ChangesetExecutor } from './ChangesetExecutor.js';
import {
  Context,
  Changeset,
  IModel,
  Transaction,
  OptimisticPromise,
} from '@aphro/context-runtime-ts';
import tracer from './trace.js';

type ExtractValue<T extends readonly Changeset<any, any>[]> = {
  [K in keyof T]: T[K] extends Changeset<infer V, infer D> ? V : never;
};

export function commit<M extends IModel<D>, D extends {}>(
  ctx: Context,
  changesets: Changeset<M>,
): OptimisticPromise<M>;
export function commit<T extends ReadonlyArray<Changeset<any, any>>>(
  ctx: Context,
  ...changesets: T
): OptimisticPromise<[...ExtractValue<T>]>;
export function commit<T extends ReadonlyArray<Changeset<any, any>>>(
  ctx: Context,
  changesets: T,
): OptimisticPromise<[...ExtractValue<T>]>;

export function commit<T extends readonly Changeset<any, any>[]>(
  ctx: Context,
  ...changesets: T
): OptimisticPromise<[...ExtractValue<T>]> {
  return tracer.startActiveSpan('commit', () => {
    // Handle overloads.
    let singular = false;
    if (Array.isArray(changesets[0])) {
      // The user called commit like: commit(ctx, [cs1, ...]);
      changesets = changesets[0] as any;
    } else if (changesets.length === 1) {
      // The user called commit like: commit(ctx, cs1);
      singular = true;
    }
    // else -- the user called commit like: commit(ctx, cs1, cs2, ...);

    const transaction = new ChangesetExecutor(ctx, changesets).execute();

    const optimistic = changesets.map(cs => transaction.nodes.get(cs.id));
    let result: any;
    if (singular) {
      result = optimistic[0];
    } else {
      result = optimistic;
    }
    const ret = new OptimisticPromise((resolve, reject) => {
      transaction.persistHandle.then(
        () =>
          // explain why we can use `optimistic` results here
          resolve(result),
        reject,
      );
    });
    ret.__setOptimisticResult(result);

    return ret as any;
  });
}

// TODO: we need to re-enable optimistic updates + delayed persists.
// and test the interaction of this with live queries.

// Give the user more control of how commits are handled.
// One reason is to delay actual persisting of data for highly-interactive applications.
// The user can provide their own `persistor` impl which collects updates and persists after some delay.
// Or maybe it throws all persists out except the last one and runs that via debounce.
type CommitOptions = {
  ctx: Context;
  persistor?: (ctx: Context, tx: Omit<Transaction, 'persistHandle'>) => Promise<[void, void]>;
};

// export function commitExt<M extends IModel<D>, D>(
//   opts: CommitOptions,
//   changesets: Changeset<M>,
// ): [Promise<any>, M];
// export function commitExt<T extends ReadonlyArray<Changeset<any, any>>>(
//   opts: CommitOptions,
//   changesets: T,
// ): [Promise<any>, ...ExtractValue<T>];
// export function commitExt<T extends ReadonlyArray<Changeset<any, any>>>(
//   opts: CommitOptions,
//   ...changesets: T
// ): [Promise<any>, ...ExtractValue<T>];

// export function commitExt<T extends readonly Changeset<any, any>[]>(
//   opts: CommitOptions,
//   ...changesets: T
// ): [Promise<any>, ...ExtractValue<T>] {
//   throw new Error();
// }
