// SIGNED-SOURCE: <2b600b7ac6bb3deb80980d4c25525ca6>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { decodeModelData } from "@aphro/runtime-ts";
import { encodeModelData } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as TrackSpec } from "./TrackSpec.js";
import Genre from "../Genre.js";
import { Data } from "./GenreBase.js";

const fields = {
  id: {
    encoding: "none",
  },
  name: {
    encoding: "none",
  },
} as const;
const GenreSpec: NodeSpecWithCreate<Genre, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data, raw: boolean = true) {
    const existing = ctx.cache.get(data["id"], "chinook", "genre");
    if (existing) {
      return existing;
    }
    if (raw) data = decodeModelData(data, fields);
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

  fields,

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
