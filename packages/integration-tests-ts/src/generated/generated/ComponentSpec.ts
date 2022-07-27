// SIGNED-SOURCE: <bf705bf757b715fff4db1f17d74d09d6>
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
    const existing = ctx.cache.get(data["id"], "example", "component");
    if (existing) {
      return existing;
    }
    data = decodeModelData(data, fields);
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

  fields,

  outboundEdges: {},
};

export default ComponentSpec;
