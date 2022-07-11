// SIGNED-SOURCE: <4160ac8a2de7c7ae4c3e22f97d6323c3>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import Identity from "./Identity.js";
import { Data } from "./Identity.js";

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
