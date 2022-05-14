// SIGNED-SOURCE: <2e27f94662b46a59e1d0a0927f869d7f>
import { Context } from "@aphro/context-runtime-ts";
import { ModelSpec } from "@aphro/model-runtime-ts";
import { default as DeckSpec } from "./DeckSpec.js";
import User from "./User.js";
import { Data } from "./User.js";

const spec: ModelSpec<User, Data> = {
  createFrom(ctx: Context, data: Data) {
    return new User(ctx, data);
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
