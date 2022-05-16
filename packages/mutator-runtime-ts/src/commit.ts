import { ChangesetExecutor } from './ChangesetExecutor.js';
import { Changeset } from './Changeset.js';
import { Context } from '@aphro/context-runtime-ts';
import { IModel } from '@aphro/model-runtime-ts';

export function commit(ctx: Context, changesets: Changeset<IModel>[]): Promise<void> {
  const transaciton = new ChangesetExecutor(ctx, changesets).execute();
  // return new ChangesetExecutor(context, changesets, options).execute();
}
