import { CreateArgs } from "./DeckMutations.js";
import { SelectSlideArgs } from "./DeckMutations.js";
import { RenameArgs } from "./DeckMutations.js";
import { DeleteArgs } from "./DeckMutations.js";
import { Changeset, sid } from "@aphro/runtime-ts";
import { Data } from "./Deck.js";
import Deck from "./Deck.js";
import { IMutationBuilder } from "@aphro/runtime-ts";

export function createImpl(
  mutator: Omit<IMutationBuilder<Deck, Data>, "toChangeset">,
  { name, owner, selectedSlide }: CreateArgs
): void | Changeset<any>[] {
  mutator.set({
    id: sid("test"),
    name,
    ownerId: owner.id,
    selectedSlideId: selectedSlide?.id,
  });
}

export function selectSlideImpl(
  mutator: Omit<IMutationBuilder<Deck, Data>, "toChangeset">,
  { selectedSlide }: SelectSlideArgs
): void | Changeset<any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
}

export function renameImpl(
  mutator: Omit<IMutationBuilder<Deck, Data>, "toChangeset">,
  { name }: RenameArgs
): void | Changeset<any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
}

export function deleteImpl(
  mutator: Omit<IMutationBuilder<Deck, Data>, "toChangeset">,
  {}: DeleteArgs
): void | Changeset<any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
}
