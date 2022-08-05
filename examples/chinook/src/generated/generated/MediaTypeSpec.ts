// SIGNED-SOURCE: <cc5cbe7063169c63b1eb43197b50269a>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { decodeModelData } from "@aphro/runtime-ts";
import { encodeModelData } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import MediaType from "../MediaType.js";
import { Data } from "./MediaTypeBase.js";

const fields = {
  id: {
    encoding: "none",
  },
  name: {
    encoding: "none",
  },
} as const;
const MediaTypeSpec: NodeSpecWithCreate<MediaType, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data, raw: boolean = true) {
    const existing = ctx.cache.get(data["id"], "chinook", "mediatype");
    if (existing) {
      return existing;
    }
    if (raw) data = decodeModelData(data, fields);
    const result = new MediaType(ctx, data);
    ctx.cache.set(data["id"], result, "chinook", "mediatype");
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "chinook",
    type: "sql",
    tablish: "mediatype",
  },

  fields,

  outboundEdges: {},
};

export default MediaTypeSpec;
