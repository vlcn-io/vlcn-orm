// SIGNED-SOURCE: <3a60644a48e2975bbaf578c9bc49b39a>
import { ModelSpec } from "@aphro/model-runtime-ts";
import Component from "./Component.js";
import { Data } from "./Component.js";

const spec: ModelSpec<Component, Data> = {
  createFrom(data: Data) {
    return new Component(data);
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
