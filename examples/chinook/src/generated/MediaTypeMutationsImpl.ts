import { CreateArgs } from "./MediaTypeMutations.js";
import { RenameArgs } from "./MediaTypeMutations.js";
import { Changeset } from "@aphro/runtime-ts";
import { Data } from "./MediaType.js";
import MediaType from "./MediaType.js";
import { IMutationBuilder } from "@aphro/runtime-ts";

export function createImpl(
  mutator: Omit<IMutationBuilder<MediaType, Data>, "toChangeset">,
  { name }: CreateArgs
): void | Changeset<any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  throw new Error(
    "You must implement the mutation create for schema MediaType in MediaTypeMutationsImpl.ts"
  );
}

export function renameImpl(
  mutator: Omit<IMutationBuilder<MediaType, Data>, "toChangeset">,
  { name }: RenameArgs
): void | Changeset<any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  throw new Error(
    "You must implement the mutation rename for schema MediaType in MediaTypeMutationsImpl.ts"
  );
}
