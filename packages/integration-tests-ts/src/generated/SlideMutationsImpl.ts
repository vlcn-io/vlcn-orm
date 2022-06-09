// SIGNED-SOURCE: <d7958be15c7ba71d9954809db29b1ff8>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { CreateArgs } from "./SlideMutations.js";
import { ReorderArgs } from "./SlideMutations.js";
import { DeleteArgs } from "./SlideMutations.js";
import { Changeset } from "@aphro/runtime-ts";
import { Data } from "./Slide.js";
import Slide from "./Slide.js";
import { IMutationBuilder } from "@aphro/runtime-ts";

export default {
  create(
    mutator: Omit<IMutationBuilder<Slide, Data>, "toChangeset">,
    { deck, order }: CreateArgs
  ): void | Changeset<any>[] {
    // Use the provided mutator to make your desired changes.
    // e.g., mutator.set({name: "Foo" });
    // You do not need to return anything from this method. The mutator will track your changes.
    // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  },

  reorder(
    mutator: Omit<IMutationBuilder<Slide, Data>, "toChangeset">,
    { order }: ReorderArgs
  ): void | Changeset<any>[] {
    // Use the provided mutator to make your desired changes.
    // e.g., mutator.set({name: "Foo" });
    // You do not need to return anything from this method. The mutator will track your changes.
    // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  },

  delete(
    mutator: Omit<IMutationBuilder<Slide, Data>, "toChangeset">,
    {}: DeleteArgs
  ): void | Changeset<any>[] {
    // Use the provided mutator to make your desired changes.
    // e.g., mutator.set({name: "Foo" });
    // You do not need to return anything from this method. The mutator will track your changes.
    // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  },
};
