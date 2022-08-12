// SIGNED-SOURCE: <2be93e2bbfae84bdf60dfa559dae80cf>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import * as impls from "../PlaylistTrackMutationsImpl.js";
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import type PlaylistTrack from "../PlaylistTrack.js";
import { default as spec } from "./PlaylistTrackSpec.js";
import { Data } from "./PlaylistTrackBase.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";
import Playlist from "../Playlist.js";
import { Data as PlaylistData } from "./PlaylistBase.js";
import Track from "../Track.js";
import { Data as TrackData } from "./TrackBase.js";

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

export default {
  create(ctx: Context, args: CreateArgs): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(ctx, spec)).create(
      args
    );
  },
};
