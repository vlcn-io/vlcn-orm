// SIGNED-SOURCE: <d5fbdabca8c45f7eafc46518b2a7ae63>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { decodeModelData } from "@aphro/runtime-ts";
import { encodeModelData } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import AppState from "../AppState.js";
import { Data } from "./AppStateBase.js";

const fields = {
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
} as const;
const AppStateSpec: NodeSpecWithCreate<AppState, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data, raw: boolean = true) {
    return new AppState(ctx, data);
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

export default AppStateSpec;
