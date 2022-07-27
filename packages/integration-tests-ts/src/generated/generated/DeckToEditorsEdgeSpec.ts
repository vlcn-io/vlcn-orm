// SIGNED-SOURCE: <fb6db96b09b6867cef11787f10f66696>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { EdgeSpecWithCreate } from "@aphro/runtime-ts";
import { default as DeckSpec } from "./DeckSpec.js";
import { default as UserSpec } from "./UserSpec.js";
import DeckToEditorsEdge from "../DeckToEditorsEdge.js";
import { Data } from "./DeckToEditorsEdgeBase.js";

const DeckToEditorsEdgeSpec: EdgeSpecWithCreate<DeckToEditorsEdge, Data> = {
  type: "junction",
  createFrom(ctx: Context, rawData: Data) {
    const existing = ctx.cache.get(
      (rawData.id1 + "-" + rawData.id2) as SID_of<DeckToEditorsEdge>,
      "example",
      "decktoeditorsedge"
    );
    if (existing) {
      return existing;
    }
    const result = new DeckToEditorsEdge(ctx, rawData);
    ctx.cache.set(
      (rawData.id1 + "-" + rawData.id2) as SID_of<DeckToEditorsEdge>,
      result,
      "example",
      "decktoeditorsedge"
    );
    return result;
  },

  sourceField: "id1",
  destField: "id2",
  get source() {
    return DeckSpec;
  },
  get dest() {
    return UserSpec;
  },

  storage: {
    engine: "sqlite",
    db: "example",
    type: "sql",
    tablish: "decktoeditorsedge",
  },

  fields: {
    id1: {
      encoding: "none",
    },
    id2: {
      encoding: "none",
    },
  },
};

export default DeckToEditorsEdgeSpec;
