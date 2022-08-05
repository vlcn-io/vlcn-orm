// SIGNED-SOURCE: <061c2ca44bae59c2d517a884d9f1e658>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { decodeModelData } from "@aphro/runtime-ts";
import { encodeModelData } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { EdgeSpecWithCreate } from "@aphro/runtime-ts";
import { default as PlaylistSpec } from "./PlaylistSpec.js";
import { default as TrackSpec } from "./TrackSpec.js";
import PlaylistTrack from "../PlaylistTrack.js";
import { Data } from "./PlaylistTrackBase.js";

const fields = {
  id1: {
    encoding: "none",
  },
  id2: {
    encoding: "none",
  },
} as const;
const PlaylistTrackSpec: EdgeSpecWithCreate<PlaylistTrack, Data> = {
  type: "junction",
  createFrom(ctx: Context, data: Data, raw: boolean = true) {
    const existing = ctx.cache.get(
      (data.id1 + "-" + data.id2) as SID_of<PlaylistTrack>,
      "chinook",
      "playlisttrack"
    );
    if (existing) {
      return existing;
    }
    if (raw) data = decodeModelData(data, fields);
    const result = new PlaylistTrack(ctx, data);
    ctx.cache.set(
      (data.id1 + "-" + data.id2) as SID_of<PlaylistTrack>,
      result,
      "chinook",
      "playlisttrack"
    );
    return result;
  },

  sourceField: "id1",
  destField: "id2",
  get source() {
    return PlaylistSpec;
  },
  get dest() {
    return TrackSpec;
  },

  storage: {
    engine: "sqlite",
    db: "chinook",
    type: "sql",
    tablish: "playlisttrack",
  },

  fields,
};

export default PlaylistTrackSpec;
