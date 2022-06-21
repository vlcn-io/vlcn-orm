// SIGNED-SOURCE: <eb76e631aec9a05f9155747c71716156>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as AlbumSpec } from "./AlbumSpec.js";
import { default as MediaTypeSpec } from "./MediaTypeSpec.js";
import { default as GenreSpec } from "./GenreSpec.js";
import { default as InvoiceLineSpec } from "./InvoiceLineSpec.js";
import Track from "./Track.js";
import { Data } from "./Track.js";

const spec: NodeSpecWithCreate<Track, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], "Track");
    if (existing) {
      return existing;
    }
    const result = new Track(ctx, data);
    ctx.cache.set(data["id"], result);
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "chinook",
    type: "sql",
    tablish: "track",
  },

  outboundEdges: {
    album: {
      type: "field",
      sourceField: "albumId",
      destField: "id",
      get source() {
        return spec;
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
        return spec;
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
        return spec;
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
        return spec;
      },
      get dest() {
        return InvoiceLineSpec;
      },
    },
  },
};

export default spec;
