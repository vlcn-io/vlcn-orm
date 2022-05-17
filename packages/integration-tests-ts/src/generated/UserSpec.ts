// SIGNED-SOURCE: <b0972c8de61777235d92531071c9d82c>
import { Context } from "@aphro/context-runtime-ts";
import { ModelSpec } from "@aphro/model-runtime-ts";
import { default as DeckSpec } from "./DeckSpec.js";
import User from "./User.js";
import { Data } from "./User.js";

const spec: ModelSpec<User, Data> = {
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data[id]);
    if (existing) {
      return existing;
    }
    return new User(ctx, data);
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
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
