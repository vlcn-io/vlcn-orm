import { CreateArgs } from './generated/DeckToEditorsEdgeMutations.js';
import { Changeset } from '@aphro/runtime-ts';
import { Data } from './generated/DeckToEditorsEdgeBase.js';
import DeckToEditorsEdge from './DeckToEditorsEdge.js';
import { IMutationBuilder } from '@aphro/runtime-ts';

export function createImpl(
  mutator: Omit<IMutationBuilder<DeckToEditorsEdge, Data>, 'toChangeset'>,
  { src, dest }: CreateArgs,
): void | Changeset<any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  throw new Error(
    'You must implement the mutation create for schema DeckToEditorsEdge in DeckToEditorsEdgeMutationsImpl.ts',
  );
}
