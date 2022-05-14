// import { ChangesetExecutor } from './ChangesetExecutor.js';
import { Changeset } from './Changeset.js';
import { Context } from '@aphro/context-runtime-ts';
import { IModel } from '@aphro/model-runtime-ts';

export type CommitOptions = {
  readonly persistNow?: boolean;
};

export function commit(
  context: Context,
  changesets: Changeset<IModel>[],
  options: CommitOptions = {},
) {
  // return new ChangesetExecutor(context, changesets, options).execute();
}
