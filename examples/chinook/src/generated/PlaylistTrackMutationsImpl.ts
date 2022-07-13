import { CreateArgs } from "./PlaylistTrackMutations.js";
import { Changeset } from "@aphro/runtime-ts";
import { Data } from "./PlaylistTrack.js";
import PlaylistTrack from "./PlaylistTrack.js";
import { IMutationBuilder } from "@aphro/runtime-ts";

export function createImpl(
  mutator: Omit<IMutationBuilder<PlaylistTrack, Data>, "toChangeset">,
  { playlist, track }: CreateArgs
): void | Changeset<any>[] {
  mutator.set({
    id1: playlist.id,
    id2: track.id,
  });
}
