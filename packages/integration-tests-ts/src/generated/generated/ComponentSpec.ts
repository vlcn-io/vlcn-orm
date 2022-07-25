// SIGNED-SOURCE: <b50bc8ada633a0e8a647be33b419bb53>
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
    const existing = ctx.cache.get(data["id"], "example", "component");
    if (existing) {
      return existing;
    }
    const result = new Component(ctx, data);
    ctx.cache.set(data["id"], result, "example", "component");
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "example",
    type: "sql",
    tablish: "component",
  },

  outboundEdges: {},
};

export default ComponentSpec;
