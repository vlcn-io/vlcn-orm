// SIGNED-SOURCE: <4e89c1eacb12a15c9cf4773b3807ee89>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { decodeModelData } from "@aphro/runtime-ts";
import { encodeModelData } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as AlbumSpec } from "./AlbumSpec.js";
import { default as MediaTypeSpec } from "./MediaTypeSpec.js";
import { default as GenreSpec } from "./GenreSpec.js";
import { default as InvoiceLineSpec } from "./InvoiceLineSpec.js";
import Track from "../Track.js";
import { Data } from "./TrackBase.js";

const fields = {
  id: {
    encoding: "none",
  },
  name: {
    encoding: "none",
  },
  albumId: {
    encoding: "none",
  },
  mediaTypeId: {
    encoding: "none",
  },
  genreId: {
    encoding: "none",
  },
  composer: {
    encoding: "none",
  },
  milliseconds: {
    encoding: "none",
  },
  bytes: {
    encoding: "none",
  },
  unitPrice: {
    encoding: "none",
  },
} as const;
const TrackSpec: NodeSpecWithCreate<Track, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data, raw: boolean = true) {
    const existing = ctx.cache.get(data["id"], "chinook", "track");
    if (existing) {
      return existing;
    }
    if (raw) data = decodeModelData(data, fields);
    const result = new Track(ctx, data);
    ctx.cache.set(data["id"], result, "chinook", "track");
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "chinook",
    type: "sql",
    tablish: "track",
  },

  fields,

  outboundEdges: {
    album: {
      type: "field",
      sourceField: "albumId",
      destField: "id",
      get source() {
        return TrackSpec;
      },
      get dest() {
        return AlbumSpec;
      },
    },
    mediaType: {
      type: "field",
      sourceField: "mediaTypeId",
      destField: "id",
      get source() {
        return TrackSpec;
      },
      get dest() {
        return MediaTypeSpec;
      },
    },
    genre: {
      type: "field",
      sourceField: "genreId",
      destField: "id",
      get source() {
        return TrackSpec;
      },
      get dest() {
        return GenreSpec;
      },
    },
    invoiceLines: {
      type: "foreignKey",
      sourceField: "id",
      destField: "trackId",
      get source() {
        return TrackSpec;
      },
      get dest() {
        return InvoiceLineSpec;
      },
    },
  },
};

export default TrackSpec;
