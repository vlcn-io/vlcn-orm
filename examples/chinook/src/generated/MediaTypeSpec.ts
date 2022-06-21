// SIGNED-SOURCE: <68ddaf491f53c15e704eee7e5349604c>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import MediaType from "./MediaType.js";
import { Data } from "./MediaType.js";

const spec: NodeSpecWithCreate<MediaType, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], "MediaType");
    if (existing) {
      return existing;
    }
    const result = new MediaType(ctx, data);
    ctx.cache.set(data["id"], result);
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "chinook",
    type: "sql",
    tablish: "mediatype",
  },

  outboundEdges: {},
};

export default spec;
