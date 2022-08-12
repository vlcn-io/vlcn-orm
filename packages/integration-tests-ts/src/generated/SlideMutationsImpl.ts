import { CreateArgs } from "./generated/SlideMutations.js";
import { ReorderArgs } from "./generated/SlideMutations.js";
import { DeleteArgs } from "./generated/SlideMutations.js";
import { Changeset, sid } from "@aphro/runtime-ts";
import { Data } from "./Slide.js";
import Slide from "./Slide.js";
import { IMutationBuilder } from "@aphro/runtime-ts";

export function createImpl(
  mutator: Omit<IMutationBuilder<Slide, Data>, "toChangeset">,
  { deck, order }: CreateArgs
): void | Changeset<any>[] {
  mutator.set({
    order,
    deckId: deck.id,
  });
}

export function reorderImpl(
  model: Slide,
  mutator: Omit<IMutationBuilder<Slide, Data>, "toChangeset">,
  { order }: ReorderArgs
): void | Changeset<any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
}

export function deleteImpl(
  model: Slide,
  mutator: Omit<IMutationBuilder<Slide, Data>, "toChangeset">,
  {}: DeleteArgs
): void | Changeset<any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
}
