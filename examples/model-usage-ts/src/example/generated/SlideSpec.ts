// SIGNED-SOURCE: <a6209b49d6539cd6ff7f76e0ad6096a0>
import { ModelSpec } from "@aphro/model-runtime-ts";
import { default as ComponentSpec } from "./ComponentSpec.js";

const spec: ModelSpec<Data> = {
  createFrom(data: Data) {
    return new Slide(data);
  },

  storage: {
    engine: "postgres",
    db: "example",
    type: "sql",
    tablish: "slide",
  },

  outboundEdges: {
    components: "",
  },
};

export default spec;
