// SIGNED-SOURCE: <4cc291624fa6ea5a6e1c36b8ec9f21d3>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import AppState from "./AppState.js";
import { Data } from "./AppStateBase.js";

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
