// SIGNED-SOURCE: <cc980046d658550e48deafa6ce003744>
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
    engine: "memory",
    db: "none",
    type: "memory",
    tablish: "component",
  },

  outboundEdges: {},
};

export default spec;
