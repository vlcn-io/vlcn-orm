// SIGNED-SOURCE: <82dffbf5fa1cddf9e9a0ec3a58f308b3>
import { ModelSpec } from "@aphro/model-runtime-ts";
import { default as DeckSpec } from "./DeckSpec.js";
import User from "./User.js";
import { Data } from "./User.js";

const spec: ModelSpec<User, Data> = {
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
