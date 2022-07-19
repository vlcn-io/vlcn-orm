// SIGNED-SOURCE: <a6ff318259e2f7df01d24ee9191b0b76>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import PlaylistTrack from "../PlaylistTrack.js";
import { default as s } from "./PlaylistTrackSpec.js";
import { P } from "@aphro/runtime-ts";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { Edge } from "@aphro/runtime-ts";
import { EdgeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import PlaylistTrackQuery from "./PlaylistTrackQuery.js";
import { Context } from "@aphro/runtime-ts";
import Playlist from "../Playlist.js";
import Track from "../Track.js";

export type Data = {
  id1: SID_of<Playlist>;
  id2: SID_of<Track>;
};

// @Sealed(PlaylistTrack)
export default abstract class PlaylistTrackBase extends Edge<Data> {
  readonly spec = s as unknown as EdgeSpecWithCreate<this, Data>;

  get id1(): SID_of<Playlist> {
    return this.data.id1;
  }

  get id2(): SID_of<Track> {
    return this.data.id2;
  }

  get id(): SID_of<this> {
    return (this.data.id1 + "-" + this.data.id2) as SID_of<this>;
  }

  static queryAll(ctx: Context): PlaylistTrackQuery {
    return PlaylistTrackQuery.create(ctx);
  }

  update(data: Partial<Data>) {
    return new UpdateMutationBuilder(this.ctx, this.spec, this)
      .set(data)
      .toChangeset();
  }

  static create(ctx: Context, data: Partial<Data>) {
    return new CreateMutationBuilder(ctx, s).set(data).toChangeset();
  }

  delete() {
    return new DeleteMutationBuilder(this.ctx, this.spec, this).toChangeset();
  }
}
