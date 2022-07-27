// SIGNED-SOURCE: <06a79be26332febe24c8df4c7468f5c5>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { decodeModelData } from "@aphro/runtime-ts";
import { encodeModelData } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import Identity from "../Identity.js";
import { Data } from "./IdentityBase.js";

const fields = {
  id: {
    encoding: "none",
  },
  identifier: {
    encoding: "none",
  },
  token: {
    encoding: "none",
  },
} as const;
const IdentitySpec: NodeSpecWithCreate<Identity, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    return new Identity(ctx, data);
  },

  primaryKey: "id",

  storage: {
    engine: "ephemeral",
    db: "--",
    type: "ephemeral",
    tablish: "ephemeral",
  },

  fields,

  outboundEdges: {},
};

export default IdentitySpec;
