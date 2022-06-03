import { ChangesetExecutor } from './ChangesetExecutor.js';
import { Context, Changeset, IModel } from '@aphro/context-runtime-ts';

type ExtractValue<T extends readonly Changeset<any, any>[]> = {
  [K in keyof T]: T[K] extends Changeset<infer V, infer D> ? V : never;
};

export function commit<M extends IModel<D>, D>(
  ctx: Context,
  changesets: Changeset<M>,
): [Promise<any>, M];
export function commit<T extends ReadonlyArray<Changeset<any, any>>>(
  ctx: Context,
  changesets: T,
): [Promise<any>, ...ExtractValue<T>];
export function commit<T extends ReadonlyArray<Changeset<any, any>>>(
  ctx: Context,
  ...changesets: T
): [Promise<any>, ...ExtractValue<T>];

export function commit<T extends readonly Changeset<any, any>[]>(
  ctx: Context,
  ...changesets: T
): [Promise<any>, ...ExtractValue<T>] {
  // Handle overloads.
  if (Array.isArray(changesets[0])) {
    changesets = changesets[0] as any;
  }
  const transaction = new ChangesetExecutor(ctx, changesets).execute();

  return [transaction.persistHandle, ...changesets.map(cs => transaction.nodes.get(cs.id))] as any;
}
