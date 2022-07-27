// SIGNED-SOURCE: <3118b3f0d90032dde892266212b381a8>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as ComponentSpec } from "./ComponentSpec.js";
import Slide from "../Slide.js";
import { Data } from "./SlideBase.js";

const SlideSpec: NodeSpecWithCreate<Slide, Data> = {
  type: "node",
  createFrom(ctx: Context, rawData: Data) {
    const existing = ctx.cache.get(rawData["id"], "none", "slide");
    if (existing) {
      return existing;
    }
    const result = new Slide(ctx, rawData);
    ctx.cache.set(rawData["id"], result, "none", "slide");
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "memory",
    db: "none",
    type: "memory",
    tablish: "slide",
  },

  fields: {
    id: {
      encoding: "none",
    },
    deckId: {
      encoding: "none",
    },
    order: {
      encoding: "none",
    },
  },
  outboundEdges: {
    components: {
      type: "foreignKey",
      sourceField: "id",
      destField: "slideId",
      get source() {
        return SlideSpec;
      },
      get dest() {
        return ComponentSpec;
      },
    },
  },
};

export default SlideSpec;
