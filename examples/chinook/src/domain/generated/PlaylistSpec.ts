// SIGNED-SOURCE: <05bdf20b87844e55009b9cf89339eba3>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { decodeModelData } from "@aphro/runtime-ts";
import { encodeModelData } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as TrackSpec } from "./TrackSpec.js";
import Playlist from "../Playlist.js";
import { Data } from "./PlaylistBase.js";

const fields = {
  id: {
    encoding: "none",
  },
  name: {
    encoding: "none",
  },
} as const;
const PlaylistSpec: NodeSpecWithCreate<Playlist, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data, raw: boolean = true) {
    const existing = ctx.cache.get(data["id"], "chinook", "playlist");
    if (existing) {
      return existing;
    }
    if (raw) data = decodeModelData(data, fields);
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

  fields,

  outboundEdges: {
    tracks: {
      type: "junction",
      storage: {
        type: "sql",
        engine: "sqlite",
        db: "chinook",
        tablish: "playlisttrack",
      },
      fields: {},
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
