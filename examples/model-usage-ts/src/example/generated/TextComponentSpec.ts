// SIGNED-SOURCE: <bd9011aa7428c27585b2874475dbd416>
import { ModelSpec } from "@aphro/model-runtime-ts";
import TextComponent from "./TextComponent.js";
import { Data } from "./TextComponent.js";
import { default as TextComponentSpec } from "./TextComponentSpec.js";

const spec: ModelSpec<Data> = {
  createFrom(data: Data) {
    return new TextComponent(data);
  },

  storage: {
    engine: "postgres",
    db: "example",
    type: "sql",
    tablish: "textcomponent",
  },

  outboundEdges: {},
};

export default spec;
