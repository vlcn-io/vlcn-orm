// SIGNED-SOURCE: <af12e2cc748103d77062d6fa809ca12d>
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
    engine: "sqlite",
    db: "example",
    type: "sql",
    tablish: "component",
  },

  outboundEdges: {},
};

export default spec;
