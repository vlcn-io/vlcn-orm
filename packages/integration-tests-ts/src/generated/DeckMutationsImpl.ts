// SIGNED-SOURCE: <45ebcbe18721300f118f0cd68cdcdb1c>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { CreateArgs } from './DeckMutations.js';
import { SelectSlideArgs } from './DeckMutations.js';
import { RenameArgs } from './DeckMutations.js';
import { DeleteArgs } from './DeckMutations.js';
import { Changeset, sid } from '@aphro/runtime-ts';
import { Data } from './Deck.js';
import Deck from './Deck.js';
import { IMutationBuilder } from '@aphro/runtime-ts';

export default {
  create(
    mutator: Omit<IMutationBuilder<Deck, Data>, 'toChangeset'>,
    { name, owner, selectedSlide }: CreateArgs,
  ): void | Changeset<any>[] {
    this.mutator.set({
      id: sid('test'),
      name,
      ownerId: owner.id,
      selectedSlideId: selectedSlide?.id,
    });
  },

  selectSlide(
    mutator: Omit<IMutationBuilder<Deck, Data>, 'toChangeset'>,
    { selectedSlide }: SelectSlideArgs,
  ): void | Changeset<any>[] {
    // Use the provided mutator to make your desired changes.
    // e.g., mutator.set({name: "Foo" });
    // You do not need to return anything from this method. The mutator will track your changes.
    // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  },

  rename(
    mutator: Omit<IMutationBuilder<Deck, Data>, 'toChangeset'>,
    { name }: RenameArgs,
  ): void | Changeset<any>[] {
    // Use the provided mutator to make your desired changes.
    // e.g., mutator.set({name: "Foo" });
    // You do not need to return anything from this method. The mutator will track your changes.
    // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  },

  delete(
    mutator: Omit<IMutationBuilder<Deck, Data>, 'toChangeset'>,
    {}: DeleteArgs,
  ): void | Changeset<any>[] {
    // Use the provided mutator to make your desired changes.
    // e.g., mutator.set({name: "Foo" });
    // You do not need to return anything from this method. The mutator will track your changes.
    // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  },
};
