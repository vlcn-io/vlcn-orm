// SIGNED-SOURCE: <5b21c360d898d91f5dbe47a0ffb0108a>
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
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], "none", "component");
    if (existing) {
      return existing;
    }
    const result = new Component(ctx, data);
    ctx.cache.set(data["id"], result, "none", "component");
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "memory",
    db: "none",
    type: "memory",
    tablish: "component",
  },

  outboundEdges: {},
};

export default ComponentSpec;
