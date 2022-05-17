// SIGNED-SOURCE: <387653de2b5e0bdf4e72a30013183d3e>
import { Context } from "@aphro/context-runtime-ts";
import { ModelSpec } from "@aphro/model-runtime-ts";
import Component from "./Component.js";
import { Data } from "./Component.js";

const spec: ModelSpec<Component, Data> = {
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"]);
    if (existing) {
      return existing;
    }
    return new Component(ctx, data);
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
