import { CreateArgs } from "./generated/PlaylistMutations.js";
import { RenameArgs } from "./generated/PlaylistMutations.js";
import { Changeset } from "@aphro/runtime-ts";
import { Data } from "./Playlist.js";
import Playlist from "./Playlist.js";
import { IMutationBuilder, sid } from "@aphro/runtime-ts";
import deviceId from "../deviceId.js";

export function createImpl(
  mutator: Omit<IMutationBuilder<Playlist, Data>, "toChangeset">,
  { name }: CreateArgs
): void | Changeset<any>[] {
  mutator.set({
    id: sid(deviceId),
    name,
  });
}

export function renameImpl(
  mutator: Omit<IMutationBuilder<Playlist, Data>, "toChangeset">,
  { name }: RenameArgs
): void | Changeset<any>[] {
  mutator.set({
    name,
  });
}
