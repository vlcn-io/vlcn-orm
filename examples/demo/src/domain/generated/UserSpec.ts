// SIGNED-SOURCE: <72ba0b61f5f639e2d931229bbd8882a4>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { decodeModelData } from "@aphro/runtime-ts";
import { encodeModelData } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import User from "../User.js";
import { Data } from "./UserBase.js";

const fields = {
  id: {
    encoding: "none",
  },
  email: {
    encoding: "none",
  },
} as const;
const UserSpec: NodeSpecWithCreate<User, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data, raw: boolean = true) {
    const existing = ctx.cache.get(data["id"], "demo", "user");
    if (existing) {
      return existing;
    }
    if (raw) data = decodeModelData(data, fields);
    const result = new User(ctx, data);
    ctx.cache.set(data["id"], result, "demo", "user");
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "demo",
    type: "sql",
    tablish: "user",
  },

  fields,

  outboundEdges: {},
};

export default UserSpec;
