// SIGNED-SOURCE: <63770b20034c187e2546d8cc861d85c8>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { decodeModelData } from "@aphro/runtime-ts";
import { encodeModelData } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import Component from "../Component.js";
import { Data } from "./ComponentBase.js";

const fields = {
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
} as const;
const ComponentSpec: NodeSpecWithCreate<Component, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], "none", "component");
    if (existing) {
      return existing;
    }
    data = decodeModelData(data, fields);
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

  fields,

  outboundEdges: {},
};

export default ComponentSpec;
