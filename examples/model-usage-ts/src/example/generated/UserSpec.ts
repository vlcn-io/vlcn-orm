// SIGNED-SOURCE: <b04da6af1b29ee81fbd9ddf3442d853f>
import { ModelSpec } from "@aphro/model-runtime-ts";
import { default as DeckSpec } from "./DeckSpec.js";
import User from "./User.js";
import { Data } from "./User.js";

const spec: ModelSpec<Data> = {
  createFrom(data: Data) {
    return new User(data);
  },

  primaryKey: "id",

  storage: {
    engine: "postgres",
    db: "example",
    type: "sql",
    tablish: "user",
  },

  outboundEdges: {
    decks: {
      type: "foreignKey",
      sourceField: "id",
      destField: "ownerId",
      get source() {
        return spec;
      },
      dest: DeckSpec,
    },
  },
};

export default spec;
