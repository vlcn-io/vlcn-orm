// SIGNED-SOURCE: <8f95b7689b4b328ce7fc6b571f4f88b9>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as DeckSpec } from "./DeckSpec.js";
import User from "../User.js";
import { Data } from "./UserBase.js";

const UserSpec: NodeSpecWithCreate<User, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], "example", "user");
    if (existing) {
      return existing;
    }
    const result = new User(ctx, data);
    ctx.cache.set(data["id"], result, "example", "user");
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
        return UserSpec;
      },
      get dest() {
        return DeckSpec;
      },
    },
  },
};

export default UserSpec;
