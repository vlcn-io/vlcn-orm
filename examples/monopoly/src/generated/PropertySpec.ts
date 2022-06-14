// SIGNED-SOURCE: <f40913f76cdd52d104697bff8ff26d5d>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { Context } from "@aphro/runtime-ts";
import { ModelSpec } from "@aphro/runtime-ts";
import Property from "./Property.js";
import { Data } from "./Property.js";

const spec: ModelSpec<Property, Data> = {
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"]);
    if (existing) {
      return existing;
    }
    const result = new Property(ctx, data);
    ctx.cache.set(data["id"], result);
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "postgres",
    db: "monopoly",
    type: "sql",
    tablish: "property",
  },

  outboundEdges: {},
};

export default spec;
