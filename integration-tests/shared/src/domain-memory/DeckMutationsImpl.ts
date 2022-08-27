import { CreateArgs } from "./generated/DeckMutations.js";
import { SelectSlideArgs } from "./generated/DeckMutations.js";
import { RenameArgs } from "./generated/DeckMutations.js";
import { DeleteArgs } from "./generated/DeckMutations.js";
import { Changeset } from "@aphro/runtime-ts";
import { Data } from "./Deck.js";
import Deck from "./Deck.js";
import { IMutationBuilder } from "@aphro/runtime-ts";

export function createImpl(
  mutator: Omit<IMutationBuilder<Deck, Data>, "toChangeset">,
  { name, owner, selectedSlide }: CreateArgs
): void | Changeset<any, any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  throw new Error(
    "You must implement the mutation create for schema Deck in DeckMutationsImpl.ts"
  );
}

export function selectSlideImpl(
  model: Deck,
  mutator: Omit<IMutationBuilder<Deck, Data>, "toChangeset">,
  { selectedSlide }: SelectSlideArgs
): void | Changeset<any, any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  throw new Error(
    "You must implement the mutation selectSlide for schema Deck in DeckMutationsImpl.ts"
  );
}

export function renameImpl(
  model: Deck,
  mutator: Omit<IMutationBuilder<Deck, Data>, "toChangeset">,
  { name }: RenameArgs
): void | Changeset<any, any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  throw new Error(
    "You must implement the mutation rename for schema Deck in DeckMutationsImpl.ts"
  );
}

export function deleteImpl(
  model: Deck,
  mutator: Omit<IMutationBuilder<Deck, Data>, "toChangeset">,
  {}: DeleteArgs
): void | Changeset<any, any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  throw new Error(
    "You must implement the mutation delete for schema Deck in DeckMutationsImpl.ts"
  );
}
