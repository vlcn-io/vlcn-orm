// SIGNED-SOURCE: <02ca9124afc78f3afe250cfb98b7fb85>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as ArtistSpec } from "./ArtistSpec.js";
import { default as TrackSpec } from "./TrackSpec.js";
import Album from "./Album.js";
import { Data } from "./Album.js";

const spec: NodeSpecWithCreate<Album, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"]);
    if (existing) {
      return existing;
    }
    const result = new Album(ctx, data);
    ctx.cache.set(data["id"], result);
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "chinook",
    type: "sql",
    tablish: "album",
  },

  outboundEdges: {
    artist: {
      type: "field",
      sourceField: "artistId",
      destField: "id",
      get source() {
        return spec;
      },
      get dest() {
        return ArtistSpec;
      },
    },
    tracks: {
      type: "foreignKey",
      sourceField: "id",
      destField: "albumId",
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
