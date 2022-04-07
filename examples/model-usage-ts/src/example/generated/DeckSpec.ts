// SIGNED-SOURCE: <04957a0777ba0c89d729b62fcf3863d1>
import { ModelSpec } from "@aphro/model-runtime-ts";
import { default as UserSpec } from "./UserSpec.js";
import { default as SlideSpec } from "./SlideSpec.js";

const spec: ModelSpec<Data> = {
  createFrom(data: Data) {
    return new Deck(data);
  },

  storage: {
    engine: "postgres",
    db: "example",
    type: "sql",
    tablish: "deck",
  },

  outboundEdges: {
    owner: "",
    slides: "",
  },
};

export default spec;
