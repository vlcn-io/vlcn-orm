import { ChangesetExecutor, Transaction } from './ChangesetExecutor.js';
import { Context, IModel, Changeset } from '@aphro/context-runtime-ts';

export function commit<M extends IModel<D>, D>(
  ctx: Context,
  changesets: [Changeset<M>],
): [Promise<any>, M];
export function commit<M1 extends IModel<D1>, D1, M2 extends IModel<D2>, D2>(
  ctx: Context,
  changesets: [Changeset<M1>, Changeset<M2>],
): [Promise<any>, M1, M2];
export function commit<
  M1 extends IModel<D1>,
  D1,
  M2 extends IModel<D2>,
  D2,
  M3 extends IModel<D3>,
  D3,
>(
  ctx: Context,
  changesets: [Changeset<M1>, Changeset<M2>, Changeset<M3>],
): [Promise<any>, M1, M2, M3];
export function commit<
  M1 extends IModel<D1>,
  D1,
  M2 extends IModel<D2>,
  D2,
  M3 extends IModel<D3>,
  D3,
  M4 extends IModel<D4>,
  D4,
>(
  ctx: Context,
  changesets: [Changeset<M1>, Changeset<M2>, Changeset<M3>, Changeset<M4>],
): [Promise<any>, M1, M2, M3, M4];
export function commit<
  M1 extends IModel<D1>,
  D1,
  M2 extends IModel<D2>,
  D2,
  M3 extends IModel<D3>,
  D3,
  M4 extends IModel<D4>,
  D4,
  M5 extends IModel<D5>,
  D5,
>(
  ctx: Context,
  changesets: [Changeset<M1>, Changeset<M2>, Changeset<M3>, Changeset<M4>, Changeset<M5>],
): [Promise<any>, M1, M2, M3, M4, M5];
export function commit<
  M1 extends IModel<D1>,
  D1,
  M2 extends IModel<D2>,
  D2,
  M3 extends IModel<D3>,
  D3,
  M4 extends IModel<D4>,
  D4,
  M5 extends IModel<D5>,
  D5,
  M6 extends IModel<D6>,
  D6,
>(
  ctx: Context,
  changesets: [
    Changeset<M1>,
    Changeset<M2>,
    Changeset<M3>,
    Changeset<M4>,
    Changeset<M5>,
    Changeset<M6>,
  ],
): [Promise<any>, M1, M2, M3, M4, M5, M6];

export function commit(ctx: Context, changesets: Changeset<any>[]): [Promise<any>, ...IModel[]];

export function commit(ctx: Context, changesets: Changeset<any>[]): [Promise<any>, ...IModel[]] {
  const transaction = new ChangesetExecutor(ctx, changesets).execute();

  return [transaction.persistHandle, ...changesets.map(cs => transaction.nodes.getx(cs.id))];
}

/*
export function commit(ctx: Context, changesets: Changeset<any>[]): CommitPromise {
  const transaction = new ChangesetExecutor(ctx, changesets).execute();
  const persistor = new Persistor(ctx);

  return new CommitPromise(transaction.nodes, (resolve, reject) => {
    persistor.persist(transaction).then(() => {
      resolve();
    }, reject);
  });
}
*/

/*
Attempt at mapped tuples rather than overloads...

T extends readonly Changeset<
    M[keyof T extends number ? keyof T : never],
    D[keyof T extends number ? keyof T : never]
  >[],
  M extends readonly IModel<D[keyof T extends number ? keyof T : never]>[],
  D extends { [K in keyof T]: K extends number ? D[K] : never },
*/
