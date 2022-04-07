// SIGNED-SOURCE: <9d1fae6d1c02897bad86126e0b573b30>
import { ModelSpec } from "@aphro/model-runtime-ts";
import { default as DeckSpec } from "./DeckSpec.js";
import User from "./User.js";
import { Data } from "./User.js";
import { default as UserSpec } from "./UserSpec.js";

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
    decks: {
      type: "foreignKey",
      sourceField: "id",
      destField: "ownerId",
      source: UserSpec,
      dest: DeckSpec,
    },
  },
};

export default spec;
