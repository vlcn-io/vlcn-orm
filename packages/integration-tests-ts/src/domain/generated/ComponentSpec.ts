// SIGNED-SOURCE: <470d460f19df54a1e8670e08dce804c4>
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
  createFrom(ctx: Context, data: Data, raw: boolean = true) {
    const existing = ctx.cache.get(data["id"], "example", "component");
    if (existing) {
      return existing;
    }
    if (raw) data = decodeModelData(data, fields);
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
