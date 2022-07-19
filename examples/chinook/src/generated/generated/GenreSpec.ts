// SIGNED-SOURCE: <a25b2b67f4c69d2ef535547874e4460c>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as TrackSpec } from "./TrackSpec.js";
import Genre from "../Genre.js";
import { Data } from "./GenreBase.js";

const spec: NodeSpecWithCreate<Genre, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], "chinook", "genre");
    if (existing) {
      return existing;
    }
    const result = new Genre(ctx, data);
    ctx.cache.set(data["id"], result, "chinook", "genre");
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "chinook",
    type: "sql",
    tablish: "genre",
  },

  outboundEdges: {
    tracks: {
      type: "foreignKey",
      sourceField: "id",
      destField: "genreId",
      get source() {
        return spec;
      },
      get dest() {
        return TrackSpec;
      },
    },
  },
};

export default spec;
