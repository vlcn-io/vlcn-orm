// SIGNED-SOURCE: <1d724b8dc52da4c80ebf40273ee4a950>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { EdgeSpecWithCreate } from "@aphro/runtime-ts";
import { default as DeckSpec } from "./DeckSpec.js";
import { default as UserSpec } from "./UserSpec.js";
import DeckToEditorsEdge from "./DeckToEditorsEdge.js";
import { Data } from "./DeckToEditorsEdgeBase.js";

const spec: EdgeSpecWithCreate<DeckToEditorsEdge, Data> = {
  type: "junction",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(
      (data.id1 + "-" + data.id2) as SID_of<DeckToEditorsEdge>,
      DeckToEditorsEdge.name
    );
    if (existing) {
      return existing;
    }
    const result = new DeckToEditorsEdge(ctx, data);
    ctx.cache.set(
      (data.id1 + "-" + data.id2) as SID_of<DeckToEditorsEdge>,
      result
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

export default spec;
