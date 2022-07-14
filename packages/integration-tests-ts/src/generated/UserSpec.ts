// SIGNED-SOURCE: <ee0c4983ab0a8738668c5b0e42742347>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as DeckSpec } from "./DeckSpec.js";
import User from "./User.js";
import { Data } from "./UserBase.js";

const spec: NodeSpecWithCreate<User, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], User.name);
    if (existing) {
      return existing;
    }
    const result = new User(ctx, data);
    ctx.cache.set(data["id"], result);
    return result;
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
      get dest() {
        return DeckSpec;
      },
    },
  },
};

export default spec;
