// SIGNED-SOURCE: <772998320477f45d1dca94c14016c9a5>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as albumSpec } from "./albumSpec.js";
import Artist from "./Artist.js";
import { Data } from "./Artist.js";

const spec: NodeSpecWithCreate<Artist, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], Artist.name);
    if (existing) {
      return existing;
    }
    const result = new Artist(ctx, data);
    ctx.cache.set(data["id"], result);
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
