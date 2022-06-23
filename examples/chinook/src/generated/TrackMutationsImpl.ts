import { CreateArgs } from "./TrackMutations.js";
import { Changeset } from "@aphro/runtime-ts";
import { Data } from "./Track.js";
import Track from "./Track.js";
import { IMutationBuilder } from "@aphro/runtime-ts";

export function createImpl(
  mutator: Omit<IMutationBuilder<Track, Data>, "toChangeset">,
  {
    name,
    album,
    mediaType,
    genre,
    composer,
    milliseconds,
    bytes,
    unitPrice,
  }: CreateArgs
): void | Changeset<any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  throw new Error(
    "You must implement the mutation create for schema Track in TrackMutationsImpl.ts"
  );
}
