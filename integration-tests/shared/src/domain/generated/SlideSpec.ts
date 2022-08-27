// SIGNED-SOURCE: <42f836a2040b7c92f4ceb3b5e8f65405>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { decodeModelData } from "@aphro/runtime-ts";
import { encodeModelData } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as ComponentSpec } from "./ComponentSpec.js";
import Slide from "../Slide.js";
import { Data } from "./SlideBase.js";

const fields = {
  id: {
    encoding: "none",
  },
  deckId: {
    encoding: "none",
  },
  order: {
    encoding: "none",
  },
} as const;
const SlideSpec: NodeSpecWithCreate<Slide, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data, raw: boolean = true) {
    const existing = ctx.cache.get(data["id"], "example", "slide");
    if (existing) {
      return existing;
    }
    if (raw) data = decodeModelData(data, fields);
    const result = new Slide(ctx, data);
    ctx.cache.set(data["id"], result, "example", "slide");
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "example",
    type: "sql",
    tablish: "slide",
  },

  fields,

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
