// SIGNED-SOURCE: <7e2ccbc5be2225ac8cd1a119ca3a7265>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import AppState from "./AppState.js";
import { Data } from "./AppState.js";

const spec: NodeSpecWithCreate<AppState, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    return new AppState(ctx, data);
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
