// SIGNED-SOURCE: <1549fdebd3035a27de62170b7069bd2b>
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
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(
      (data.id1 + "-" + data.id2) as SID_of<DeckToEditorsEdge>,
      "none",
      "decktoeditorsedge"
    );
    if (existing) {
      return existing;
    }
    const result = new DeckToEditorsEdge(ctx, data);
    ctx.cache.set(
      (data.id1 + "-" + data.id2) as SID_of<DeckToEditorsEdge>,
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
};

export default DeckToEditorsEdgeSpec;
