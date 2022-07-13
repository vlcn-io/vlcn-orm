// SIGNED-SOURCE: <5db4519b4bf9143093118568f0463de3>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import MediaType from "./MediaType.js";
import { Data } from "./MediaType.js";

const spec: NodeSpecWithCreate<MediaType, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], MediaType.name);
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
