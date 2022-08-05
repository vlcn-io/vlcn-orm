// SIGNED-SOURCE: <d90947c10b9fd7b2024847f32111141f>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { decodeModelData } from "@aphro/runtime-ts";
import { encodeModelData } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as ArtistSpec } from "./ArtistSpec.js";
import { default as TrackSpec } from "./TrackSpec.js";
import Album from "../Album.js";
import { Data } from "./AlbumBase.js";

const fields = {
  id: {
    encoding: "none",
  },
  title: {
    encoding: "none",
  },
  artistId: {
    encoding: "none",
  },
} as const;
const AlbumSpec: NodeSpecWithCreate<Album, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data, raw: boolean = true) {
    const existing = ctx.cache.get(data["id"], "chinook", "album");
    if (existing) {
      return existing;
    }
    if (raw) data = decodeModelData(data, fields);
    const result = new Album(ctx, data);
    ctx.cache.set(data["id"], result, "chinook", "album");
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "chinook",
    type: "sql",
    tablish: "album",
  },

  fields,

  outboundEdges: {
    artist: {
      type: "field",
      sourceField: "artistId",
      destField: "id",
      get source() {
        return AlbumSpec;
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
        return AlbumSpec;
      },
      get dest() {
        return TrackSpec;
      },
    },
  },
};

export default AlbumSpec;
