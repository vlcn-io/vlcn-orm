// SIGNED-SOURCE: <01ddabe339de2288cbd0df950e221b7b>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as albumSpec } from "./albumSpec.js";
import Artist from "../Artist.js";
import { Data } from "./ArtistBase.js";

const ArtistSpec: NodeSpecWithCreate<Artist, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], "chinook", "artist");
    if (existing) {
      return existing;
    }
    const result = new Artist(ctx, data);
    ctx.cache.set(data["id"], result, "chinook", "artist");
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "chinook",
    type: "sql",
    tablish: "artist",
  },

  outboundEdges: {
    albums: {
      type: "foreignKey",
      sourceField: "id",
      destField: "artistId",
      get source() {
        return ArtistSpec;
      },
      get dest() {
        return albumSpec;
      },
    },
  },
};

export default ArtistSpec;
