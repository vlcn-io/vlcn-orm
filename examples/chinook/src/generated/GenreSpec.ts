// SIGNED-SOURCE: <5f966489b90a0b20d3b8d1e72e487448>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as TrackSpec } from "./TrackSpec.js";
import Genre from "./Genre.js";
import { Data } from "./Genre.js";

const spec: NodeSpecWithCreate<Genre, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], Genre.name);
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
