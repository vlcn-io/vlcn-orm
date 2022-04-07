// SIGNED-SOURCE: <4332da427d3e50e331e8b23721a59caa>
import { ModelSpec } from "@aphro/model-runtime-ts";
import { default as ComponentSpec } from "./ComponentSpec.js";
import Slide from "./Slide.js";
import { Data } from "./Slide.js";
import { default as SlideSpec } from "./SlideSpec.js";

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
    components: {
      type: "foreignKey",
      sourceField: "id",
      destField: "slideId",
      source: SlideSpec,
      dest: ComponentSpec,
    },
  },
};

export default spec;
