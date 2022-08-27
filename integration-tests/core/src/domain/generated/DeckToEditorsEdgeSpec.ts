// SIGNED-SOURCE: <40ee1bf633f7e20def51eaa63145779b>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { decodeModelData } from "@aphro/runtime-ts";
import { encodeModelData } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { EdgeSpecWithCreate } from "@aphro/runtime-ts";
import { default as DeckSpec } from "./DeckSpec.js";
import { default as UserSpec } from "./UserSpec.js";
import DeckToEditorsEdge from "../DeckToEditorsEdge.js";
import { Data } from "./DeckToEditorsEdgeBase.js";

const fields = {
  id1: {
    encoding: "none",
  },
  id2: {
    encoding: "none",
  },
} as const;
const DeckToEditorsEdgeSpec: EdgeSpecWithCreate<DeckToEditorsEdge, Data> = {
  type: "junction",
  createFrom(ctx: Context, data: Data, raw: boolean = true) {
    const existing = ctx.cache.get(
      (data.id1 + "-" + data.id2) as SID_of<DeckToEditorsEdge>,
      "example",
      "decktoeditorsedge"
    );
    if (existing) {
      return existing;
    }
    if (raw) data = decodeModelData(data, fields);
    const result = new DeckToEditorsEdge(ctx, data);
    ctx.cache.set(
      (data.id1 + "-" + data.id2) as SID_of<DeckToEditorsEdge>,
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

  fields,
};

export default DeckToEditorsEdgeSpec;
