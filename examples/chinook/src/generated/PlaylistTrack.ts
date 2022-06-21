// SIGNED-SOURCE: <65f18375510d5578561763807a1d7a94>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { default as s } from "./PlaylistTrackSpec.js";
import { P } from "@aphro/runtime-ts";
import { Edge } from "@aphro/runtime-ts";
import { EdgeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import PlaylistTrackQuery from "./PlaylistTrackQuery.js";
import { Context } from "@aphro/runtime-ts";
import Playlist from "./Playlist.js";
import Track from "./Track.js";

export type Data = {
  id1: SID_of<Playlist>;
  id2: SID_of<Track>;
};

export default class PlaylistTrack extends Edge<Data> {
  readonly spec = s as EdgeSpecWithCreate<this, Data>;

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
}
