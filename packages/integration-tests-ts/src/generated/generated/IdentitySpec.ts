// SIGNED-SOURCE: <da09ed0d8eac6881fea652655519f257>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import Identity from "../Identity.js";
import { Data } from "./IdentityBase.js";

const spec: NodeSpecWithCreate<Identity, Data> = {
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

  outboundEdges: {},
};

export default spec;
