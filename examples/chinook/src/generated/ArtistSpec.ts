// SIGNED-SOURCE: <a62f076c53e88c4a1163855f7fa22670>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
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
