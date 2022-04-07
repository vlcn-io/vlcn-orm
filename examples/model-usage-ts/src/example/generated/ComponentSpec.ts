// SIGNED-SOURCE: <fdcb6fa7a7716ca1c5df95573510d6ec>
import { ModelSpec } from "@aphro/model-runtime-ts";
import Component from "./Component.js";
import { Data } from "./Component.js";
import { default as ComponentSpec } from "./ComponentSpec.js";

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
