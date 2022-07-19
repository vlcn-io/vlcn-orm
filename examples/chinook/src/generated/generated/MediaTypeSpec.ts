// SIGNED-SOURCE: <0f85bd67ea404fa8e429c240731880fe>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import MediaType from "../MediaType.js";
import { Data } from "./MediaTypeBase.js";

const spec: NodeSpecWithCreate<MediaType, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], "chinook", "mediatype");
    if (existing) {
      return existing;
    }
    const result = new MediaType(ctx, data);
    ctx.cache.set(data["id"], result, "chinook", "mediatype");
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
