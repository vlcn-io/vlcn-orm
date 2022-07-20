// SIGNED-SOURCE: <214bcde6568df7552363bcca6a9127a9>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as ArtistSpec } from "./ArtistSpec.js";
import { default as TrackSpec } from "./TrackSpec.js";
import Album from "../Album.js";
import { Data } from "./AlbumBase.js";

const AlbumSpec: NodeSpecWithCreate<Album, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], "chinook", "album");
    if (existing) {
      return existing;
    }
    const result = new Album(ctx, data);
    ctx.cache.set(data["id"], result, "chinook", "album");
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "chinook",
    type: "sql",
    tablish: "album",
  },

  outboundEdges: {
    artist: {
      type: "field",
      sourceField: "artistId",
      destField: "id",
      get source() {
        return AlbumSpec;
      },
      get dest() {
        return ArtistSpec;
      },
    },
    tracks: {
      type: "foreignKey",
      sourceField: "id",
      destField: "albumId",
      get source() {
        return AlbumSpec;
      },
      get dest() {
        return TrackSpec;
      },
    },
  },
};

export default AlbumSpec;
