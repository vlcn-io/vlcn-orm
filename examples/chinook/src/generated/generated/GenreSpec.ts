// SIGNED-SOURCE: <59ff2d3dc1df94e7f4ca16fad9132829>
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

const GenreSpec: NodeSpecWithCreate<Genre, Data> = {
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
        return GenreSpec;
      },
      get dest() {
        return TrackSpec;
      },
    },
  },
};

export default GenreSpec;
