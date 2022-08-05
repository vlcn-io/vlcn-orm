// SIGNED-SOURCE: <99a8851fc4f6619b71e19ce89ce40e7f>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { decodeModelData } from "@aphro/runtime-ts";
import { encodeModelData } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as albumSpec } from "./albumSpec.js";
import Artist from "../Artist.js";
import { Data } from "./ArtistBase.js";

const fields = {
  id: {
    encoding: "none",
  },
  name: {
    encoding: "none",
  },
} as const;
const ArtistSpec: NodeSpecWithCreate<Artist, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data, raw: boolean = true) {
    const existing = ctx.cache.get(data["id"], "chinook", "artist");
    if (existing) {
      return existing;
    }
    if (raw) data = decodeModelData(data, fields);
    const result = new Artist(ctx, data);
    ctx.cache.set(data["id"], result, "chinook", "artist");
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "chinook",
    type: "sql",
    tablish: "artist",
  },

  fields,

  outboundEdges: {
    albums: {
      type: "foreignKey",
      sourceField: "id",
      destField: "artistId",
      get source() {
        return ArtistSpec;
      },
      get dest() {
        return albumSpec;
      },
    },
  },
};

export default ArtistSpec;
