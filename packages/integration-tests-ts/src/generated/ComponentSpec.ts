// SIGNED-SOURCE: <84222105968a532564ed454f5343bc58>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import Component from "./Component.js";
import { Data } from "./ComponentBase.js";

const spec: NodeSpecWithCreate<Component, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], Component.name);
    if (existing) {
      return existing;
    }
    const result = new Component(ctx, data);
    ctx.cache.set(data["id"], result);
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

export default spec;
