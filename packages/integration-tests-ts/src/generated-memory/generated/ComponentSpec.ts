// SIGNED-SOURCE: <ba72a0d295cc795ab229e4c40554bd10>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import Component from "../Component.js";
import { Data } from "./ComponentBase.js";

const ComponentSpec: NodeSpecWithCreate<Component, Data> = {
  type: "node",
  createFrom(ctx: Context, rawData: Data) {
    const existing = ctx.cache.get(rawData["id"], "none", "component");
    if (existing) {
      return existing;
    }
    const result = new Component(ctx, rawData);
    ctx.cache.set(rawData["id"], result, "none", "component");
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "memory",
    db: "none",
    type: "memory",
    tablish: "component",
  },

  fields: {
    id: {
      encoding: "none",
    },
    subtype: {
      encoding: "none",
    },
    slideId: {
      encoding: "none",
    },
    content: {
      encoding: "none",
    },
  },
  outboundEdges: {},
};

export default ComponentSpec;
