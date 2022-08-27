import { CreateArgs } from "./generated/SlideMutations.js";
import { ReorderArgs } from "./generated/SlideMutations.js";
import { DeleteArgs } from "./generated/SlideMutations.js";
import { Changeset } from "@aphro/runtime-ts";
import { Data } from "./Slide.js";
import Slide from "./Slide.js";
import { IMutationBuilder } from "@aphro/runtime-ts";

export function createImpl(
  mutator: Omit<IMutationBuilder<Slide, Data>, "toChangeset">,
  { deck, order }: CreateArgs
): void | Changeset<any, any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  throw new Error(
    "You must implement the mutation create for schema Slide in SlideMutationsImpl.ts"
  );
}

export function reorderImpl(
  model: Slide,
  mutator: Omit<IMutationBuilder<Slide, Data>, "toChangeset">,
  { order }: ReorderArgs
): void | Changeset<any, any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  throw new Error(
    "You must implement the mutation reorder for schema Slide in SlideMutationsImpl.ts"
  );
}

export function deleteImpl(
  model: Slide,
  mutator: Omit<IMutationBuilder<Slide, Data>, "toChangeset">,
  {}: DeleteArgs
): void | Changeset<any, any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  throw new Error(
    "You must implement the mutation delete for schema Slide in SlideMutationsImpl.ts"
  );
}
