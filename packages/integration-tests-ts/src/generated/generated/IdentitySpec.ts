// SIGNED-SOURCE: <f9e6462c740e978e3d9c998bbea6b365>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import Identity from "../Identity.js";
import { Data } from "./IdentityBase.js";

const IdentitySpec: NodeSpecWithCreate<Identity, Data> = {
  type: "node",
  createFrom(ctx: Context, rawData: Data) {
    return new Identity(ctx, rawData);
  },

  primaryKey: "id",

  storage: {
    engine: "ephemeral",
    db: "--",
    type: "ephemeral",
    tablish: "ephemeral",
  },

  fields: {
    id: {
      encoding: "none",
    },
    identifier: {
      encoding: "none",
    },
    token: {
      encoding: "none",
    },
  },
  outboundEdges: {},
};

export default IdentitySpec;
