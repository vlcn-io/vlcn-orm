// SIGNED-SOURCE: <7716cf94c4343587c2df413f4f0b0722>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { Context } from "@aphro/runtime-ts";
import { ModelSpec } from "@aphro/runtime-ts";
import { default as PlayerSpec } from "./PlayerSpec.js";
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

  outboundEdges: {
    owner: {
      type: "field",
      sourceField: "ownerId",
      destField: "id",
      get source() {
        return spec;
      },
      get dest() {
        return PlayerSpec;
      },
    },
  },
};

export default spec;
