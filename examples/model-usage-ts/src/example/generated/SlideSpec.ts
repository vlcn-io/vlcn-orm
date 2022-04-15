// SIGNED-SOURCE: <f384e609c49a5c408dad667d05bc7fe4>
import { ModelSpec } from "@aphro/model-runtime-ts";
import { default as ComponentSpec } from "./ComponentSpec.js";
import Slide from "./Slide.js";
import { Data } from "./Slide.js";

const spec: ModelSpec<Data, Slide> = {
  createFrom(data: Data) {
    return new Slide(data);
  },

  primaryKey: "id",

  storage: {
    engine: "postgres",
    db: "example",
    type: "sql",
    tablish: "slide",
  },

  outboundEdges: {
    components: {
      type: "foreignKey",
      sourceField: "id",
      destField: "slideId",
      get source() {
        return spec;
      },
      dest: ComponentSpec,
    },
  },
};

export default spec;
