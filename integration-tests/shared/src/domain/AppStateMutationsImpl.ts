import { CreateArgs } from './generated/AppStateMutations.js';
import { OpenDeckArgs } from './generated/AppStateMutations.js';
import { Changeset, sid } from '@aphro/runtime-ts';
import { Data } from './AppState.js';
import AppState from './AppState.js';
import { IMutationBuilder } from '@aphro/runtime-ts';
import Identity from './Identity.js';

export function createImpl(
  mutator: Omit<IMutationBuilder<AppState, Data>, 'toChangeset'>,
  { identity, openDeckId }: CreateArgs,
): void | Changeset<any>[] {
  mutator.set({
    id: sid('aaaa'),
    identity: identity as Identity, // TODO: nested field shouldn't be able to take changesets
    openDeckId: openDeckId || undefined,
  });
}

export function openDeckImpl(
  model: AppState,
  mutator: Omit<IMutationBuilder<AppState, Data>, 'toChangeset'>,
  { openDeck }: OpenDeckArgs,
): void | Changeset<any>[] {
  mutator.set({
    openDeckId: openDeck,
  });
}
