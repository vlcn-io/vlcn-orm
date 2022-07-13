// SIGNED-SOURCE: <ee237db192c2ff7ff0b8a49b510365f3>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import * as impls from "./PlaylistTrackMutationsImpl.js";
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import PlaylistTrack from "./PlaylistTrack.js";
import { default as spec } from "./PlaylistTrackSpec.js";
import { Data } from "./PlaylistTrack.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";
import Playlist from "./Playlist.js";
import { Data as PlaylistData } from "./Playlist.js";
import Track from "./Track.js";
import { Data as TrackData } from "./Track.js";

export type CreateArgs = {
  playlist: Playlist | Changeset<Playlist, PlaylistData>;
  track: Track | Changeset<Track, TrackData>;
};
class Mutations extends MutationsBase<PlaylistTrack, Data> {
  constructor(
    ctx: Context,
    mutator: ICreateOrUpdateBuilder<PlaylistTrack, Data>
  ) {
    super(ctx, mutator);
  }

  create(args: CreateArgs): this {
    const extraChangesets = impls.createImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }
}

export default class PlaylistTrackMutations {
  static create(ctx: Context, args: CreateArgs): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(ctx, spec)).create(
      args
    );
  }
}
