// SIGNED-SOURCE: <22f60e0414df2b869e4326dfbcc2498f>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import AppState from "../AppState.js";
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
