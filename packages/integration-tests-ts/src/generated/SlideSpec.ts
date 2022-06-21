// SIGNED-SOURCE: <3cea285fdc07f531018da2a9dcfbac2c>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as ComponentSpec } from "./ComponentSpec.js";
import Slide from "./Slide.js";
import { Data } from "./Slide.js";

const spec: NodeSpecWithCreate<Slide, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], Slide.name);
    if (existing) {
      return existing;
    }
    const result = new Slide(ctx, data);
    ctx.cache.set(data["id"], result);
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "example",
    type: "sql",
    tablish: "slide",
  },

  outboundEdges: {
    components: {
      type: "foreignKey",
      sourceField: "id",
      destField: "slideId",
      get source() {
        return spec;
      },
      get dest() {
        return ComponentSpec;
      },
    },
  },
};

export default spec;
