// SIGNED-SOURCE: <3d21254f60db80aed77f86ab6b76e0ea>
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

const spec: NodeSpecWithCreate<Artist, Data> = {
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
        return spec;
      },
      get dest() {
        return albumSpec;
      },
    },
  },
};

export default spec;
