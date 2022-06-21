// SIGNED-SOURCE: <1998ec6b54e7ab859e026adf8e23d65e>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import Genre from "./Genre.js";
import { Data } from "./Genre.js";

const spec: NodeSpecWithCreate<Genre, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], "Genre");
    if (existing) {
      return existing;
    }
    const result = new Genre(ctx, data);
    ctx.cache.set(data["id"], result);
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "chinook",
    type: "sql",
    tablish: "genre",
  },

  outboundEdges: {},
};

export default spec;
