import { CreateArgs } from "./ArtistMutations.js";
import { RenameArgs } from "./ArtistMutations.js";
import { Changeset } from "@aphro/runtime-ts";
import { Data } from "./Artist.js";
import Artist from "./Artist.js";
import { IMutationBuilder } from "@aphro/runtime-ts";

export function createImpl(
  mutator: Omit<IMutationBuilder<Artist, Data>, "toChangeset">,
  { name }: CreateArgs
): void | Changeset<any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  throw new Error(
    "You must implement the mutation create for schema Artist in ArtistMutationsImpl.ts"
  );
}

export function renameImpl(
  mutator: Omit<IMutationBuilder<Artist, Data>, "toChangeset">,
  { name }: RenameArgs
): void | Changeset<any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  throw new Error(
    "You must implement the mutation rename for schema Artist in ArtistMutationsImpl.ts"
  );
}
