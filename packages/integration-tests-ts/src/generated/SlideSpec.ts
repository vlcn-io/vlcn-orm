// SIGNED-SOURCE: <82758aa72ec89e931cdd3fa586d19814>
import { Context } from "@aphro/context-runtime-ts";
import { ModelSpec } from "@aphro/model-runtime-ts";
import { default as ComponentSpec } from "./ComponentSpec.js";
import Slide from "./Slide.js";
import { Data } from "./Slide.js";

const spec: ModelSpec<Slide, Data> = {
  createFrom(ctx: Context, data: Data) {
    return new Slide(ctx, data);
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
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
