import { ChangesetExecutor, Transaction } from './ChangesetExecutor.js';
import { Changeset } from './Changeset.js';
import { Context } from '@aphro/context-runtime-ts';
import { IModel } from '@aphro/model-runtime-ts';
import Persistor from './Persistor.js';

// TODO: commit should return a mapping from ids back to created things...
export function commit<M extends IModel<D>, D>(
  ctx: Context,
  changesets: Changeset<M>[],
): [Transaction, Promise<any>] {
  const transaction = new ChangesetExecutor(ctx, changesets).execute();
  const persistor = new Persistor(ctx);
  return [transaction, persistor.persist(transaction)];
}
