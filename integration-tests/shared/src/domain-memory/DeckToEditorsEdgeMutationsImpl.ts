import { CreateArgs } from './generated/DeckToEditorsEdgeMutations.js';
import { Changeset } from '@aphro/runtime-ts';
import { Data } from './generated/DeckToEditorsEdgeBase.js';
import DeckToEditorsEdge from './DeckToEditorsEdge.js';
import { IMutationBuilder } from '@aphro/runtime-ts';

export function createImpl(
  mutator: Omit<IMutationBuilder<DeckToEditorsEdge, Data>, 'toChangeset'>,
  { src, dest }: CreateArgs,
): void | Changeset<any>[] {
  mutator.set({
    id1: src.id,
    id2: dest.id,
  });
}
