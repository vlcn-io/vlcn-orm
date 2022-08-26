// SIGNED-SOURCE: <ce4970d1ea3d299d6b9a4ad1adb3bdc9>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { decodeModelData } from "@aphro/runtime-ts";
import { encodeModelData } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as DeckSpec } from "./DeckSpec.js";
import User from "../User.js";
import { Data } from "./UserBase.js";

const fields = {
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
} as const;
const UserSpec: NodeSpecWithCreate<User, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data, raw: boolean = true) {
    const existing = ctx.cache.get(data["id"], "example", "user");
    if (existing) {
      return existing;
    }
    if (raw) data = decodeModelData(data, fields);
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

  fields,

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
