// SIGNED-SOURCE: <5b28d90902a19cc546d39d1fd2738a81>
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
      "none",
      "decktoeditorsedge"
    );
    if (existing) {
      return existing;
    }
    const result = new DeckToEditorsEdge(ctx, rawData);
    ctx.cache.set(
      (rawData.id1 + "-" + rawData.id2) as SID_of<DeckToEditorsEdge>,
      result,
      "none",
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
    engine: "memory",
    db: "none",
    type: "memory",
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
