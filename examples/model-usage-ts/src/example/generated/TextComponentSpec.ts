// SIGNED-SOURCE: <9d16c81b07e8d6f13e9ede833ab7ba02>
import { ModelSpec } from "@aphro/model-runtime-ts";

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
