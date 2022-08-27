import { CreateArgs } from "./generated/ComponentMutations.js";
import { DeleteArgs } from "./generated/ComponentMutations.js";
import { Changeset } from "@aphro/runtime-ts";
import { Data } from "./Component.js";
import Component from "./Component.js";
import { IMutationBuilder } from "@aphro/runtime-ts";

export function createImpl(
  mutator: Omit<IMutationBuilder<Component, Data>, "toChangeset">,
  { subtype, slide, content }: CreateArgs
): void | Changeset<any, any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  throw new Error(
    "You must implement the mutation create for schema Component in ComponentMutationsImpl.ts"
  );
}

export function deleteImpl(
  model: Component,
  mutator: Omit<IMutationBuilder<Component, Data>, "toChangeset">,
  {}: DeleteArgs
): void | Changeset<any, any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  throw new Error(
    "You must implement the mutation delete for schema Component in ComponentMutationsImpl.ts"
  );
}
