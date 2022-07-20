// SIGNED-SOURCE: <aee5aaa64c4635b5f15cb6301f84f420>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { EdgeSpecWithCreate } from "@aphro/runtime-ts";
import { default as PlaylistSpec } from "./PlaylistSpec.js";
import { default as TrackSpec } from "./TrackSpec.js";
import PlaylistTrack from "../PlaylistTrack.js";
import { Data } from "./PlaylistTrackBase.js";

const PlaylistTrackSpec: EdgeSpecWithCreate<PlaylistTrack, Data> = {
  type: "junction",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(
      (data.id1 + "-" + data.id2) as SID_of<PlaylistTrack>,
      "chinook",
      "playlisttrack"
    );
    if (existing) {
      return existing;
    }
    const result = new PlaylistTrack(ctx, data);
    ctx.cache.set(
      (data.id1 + "-" + data.id2) as SID_of<PlaylistTrack>,
      result,
      "chinook",
      "playlisttrack"
    );
    return result;
  },

  sourceField: "id1",
  destField: "id2",
  get source() {
    return PlaylistSpec;
  },
  get dest() {
    return TrackSpec;
  },

  storage: {
    engine: "sqlite",
    db: "chinook",
    type: "sql",
    tablish: "playlisttrack",
  },
};

export default PlaylistTrackSpec;
