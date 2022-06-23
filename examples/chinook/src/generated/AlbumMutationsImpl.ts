import { CreateArgs } from "./AlbumMutations.js";
import { RetitleArgs } from "./AlbumMutations.js";
import { Changeset } from "@aphro/runtime-ts";
import { Data } from "./Album.js";
import Album from "./Album.js";
import { IMutationBuilder } from "@aphro/runtime-ts";

export function createImpl(
  mutator: Omit<IMutationBuilder<Album, Data>, "toChangeset">,
  { title, artist }: CreateArgs
): void | Changeset<any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  throw new Error(
    "You must implement the mutation create for schema Album in AlbumMutationsImpl.ts"
  );
}

export function retitleImpl(
  mutator: Omit<IMutationBuilder<Album, Data>, "toChangeset">,
  { title }: RetitleArgs
): void | Changeset<any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  throw new Error(
    "You must implement the mutation retitle for schema Album in AlbumMutationsImpl.ts"
  );
}
