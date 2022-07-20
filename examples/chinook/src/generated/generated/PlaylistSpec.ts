// SIGNED-SOURCE: <357384e7b09d192891cf654111fe75f6>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as TrackSpec } from "./TrackSpec.js";
import Playlist from "../Playlist.js";
import { Data } from "./PlaylistBase.js";

const PlaylistSpec: NodeSpecWithCreate<Playlist, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], "chinook", "playlist");
    if (existing) {
      return existing;
    }
    const result = new Playlist(ctx, data);
    ctx.cache.set(data["id"], result, "chinook", "playlist");
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "chinook",
    type: "sql",
    tablish: "playlist",
  },

  outboundEdges: {
    tracks: {
      type: "junction",
      storage: {
        type: "sql",
        engine: "sqlite",
        db: "chinook",
        tablish: "playlisttrack",
      },
      sourceField: "id",
      destField: "id",
      get source() {
        return PlaylistSpec;
      },
      get dest() {
        return TrackSpec;
      },
    },
  },
};

export default PlaylistSpec;
