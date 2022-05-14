// SIGNED-SOURCE: <6b8d7416eaa245e6a9cb59ad94298f73>
import { Context } from "@aphro/context-runtime-ts";
import { ModelSpec } from "@aphro/model-runtime-ts";
import Component from "./Component.js";
import { Data } from "./Component.js";

const spec: ModelSpec<Component, Data> = {
  createFrom(ctx: Context, data: Data) {
    return new Component(ctx, data);
  },

  primaryKey: "id",

  storage: {
    engine: "postgres",
    db: "example",
    type: "sql",
    tablish: "component",
  },

  outboundEdges: {},
};

export default spec;
