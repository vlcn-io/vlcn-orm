// SIGNED-SOURCE: <b9a72b94d905d26bbd118a3cefe93d1b>
import { ModelSpec } from "@aphro/model-runtime-ts";
import { default as DeckSpec } from "./DeckSpec.js";

const spec: ModelSpec<Data> = {
  createFrom(data: Data) {
    return new User(data);
  },

  storage: {
    engine: "postgres",
    db: "example",
    type: "sql",
    tablish: "user",
  },

  outboundEdges: {
    decks: "",
  },
};

export default spec;
