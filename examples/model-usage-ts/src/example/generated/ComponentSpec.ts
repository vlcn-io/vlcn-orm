// SIGNED-SOURCE: <c5f2fd8c8993c775a4fad38c7bd6f468>
import { ModelSpec } from "@aphro/model-runtime-ts";
import Component from "./Component.js";
import { Data } from "./Component.js";

const spec: ModelSpec<Data> = {
  createFrom(data: Data) {
    return new Component(data);
  },

  storage: {
    engine: "postgres",
    db: "example",
    type: "sql",
    tablish: "component",
  },

  outboundEdges: {},
};

export default spec;
