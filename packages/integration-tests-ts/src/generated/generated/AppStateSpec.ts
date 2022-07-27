// SIGNED-SOURCE: <f302fe0fb1223b6692feaa84ff459892>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import AppState from "../AppState.js";
import { Data } from "./AppStateBase.js";

const AppStateSpec: NodeSpecWithCreate<AppState, Data> = {
  type: "node",
  createFrom(ctx: Context, rawData: Data) {
    return new AppState(ctx, rawData);
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
    identity: {
      encoding: "json",
    },
    openDeckId: {
      encoding: "none",
    },
    copiedComponents: {
      encoding: "json",
    },
  },
  outboundEdges: {},
};

export default AppStateSpec;
