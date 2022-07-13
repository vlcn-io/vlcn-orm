// SIGNED-SOURCE: <f46da805922098b23a47f5a5a52af60e>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as ArtistSpec } from "./ArtistSpec.js";
import { default as TrackSpec } from "./TrackSpec.js";
import Album from "./Album.js";
import { Data } from "./Album.js";

const spec: NodeSpecWithCreate<Album, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], Album.name);
    if (existing) {
      return existing;
    }
    const result = new Album(ctx, data);
    ctx.cache.set(data["id"], result);
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
        return spec;
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
        return spec;
      },
      get dest() {
        return TrackSpec;
      },
    },
  },
};

export default spec;
