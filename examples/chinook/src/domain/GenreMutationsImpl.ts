import { CreateArgs } from "./generated/GenreMutations.js";
import { RenameArgs } from "./generated/GenreMutations.js";
import { Changeset } from "@aphro/runtime-ts";
import { Data } from "./Genre.js";
import Genre from "./Genre.js";
import { IMutationBuilder } from "@aphro/runtime-ts";

export function createImpl(
  mutator: Omit<IMutationBuilder<Genre, Data>, "toChangeset">,
  { name }: CreateArgs
): void | Changeset<any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  throw new Error(
    "You must implement the mutation create for schema Genre in GenreMutationsImpl.ts"
  );
}

export function renameImpl(
  model: Genre,
  mutator: Omit<IMutationBuilder<Genre, Data>, "toChangeset">,
  { name }: RenameArgs
): void | Changeset<any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  throw new Error(
    "You must implement the mutation rename for schema Genre in GenreMutationsImpl.ts"
  );
}
