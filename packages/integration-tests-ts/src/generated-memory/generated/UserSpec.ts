// SIGNED-SOURCE: <0ffb5ed479adacaa0aa021a29a017daf>
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
  createFrom(ctx: Context, rawData: Data) {
    const existing = ctx.cache.get(rawData["id"], "none", "user");
    if (existing) {
      return existing;
    }
    const result = new User(ctx, rawData);
    ctx.cache.set(rawData["id"], result, "none", "user");
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "memory",
    db: "none",
    type: "memory",
    tablish: "user",
  },

  fields: {
    id: {
      encoding: "none",
    },
    name: {
      encoding: "none",
    },
    created: {
      encoding: "none",
    },
    modified: {
      encoding: "none",
    },
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
