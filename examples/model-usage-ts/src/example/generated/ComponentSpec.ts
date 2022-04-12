// SIGNED-SOURCE: <745889145566e09b7fe2e1879b0086d4>
import { ModelSpec } from "@aphro/model-runtime-ts";
import Component from "./Component.js";
import { Data } from "./Component.js";

const spec: ModelSpec<Data> = {
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
