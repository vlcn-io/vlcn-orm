import { CreateArgs } from "./PlaylistMutations.js";
import { RenameArgs } from "./PlaylistMutations.js";
import { Changeset } from "@aphro/runtime-ts";
import { Data } from "./Playlist.js";
import Playlist from "./Playlist.js";
import { IMutationBuilder } from "@aphro/runtime-ts";

export function createImpl(
  mutator: Omit<IMutationBuilder<Playlist, Data>, "toChangeset">,
  { name }: CreateArgs
): void | Changeset<any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  throw new Error(
    "You must implement the mutation create for schema Playlist in PlaylistMutationsImpl.ts"
  );
}

export function renameImpl(
  mutator: Omit<IMutationBuilder<Playlist, Data>, "toChangeset">,
  { name }: RenameArgs
): void | Changeset<any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  throw new Error(
    "You must implement the mutation rename for schema Playlist in PlaylistMutationsImpl.ts"
  );
}
