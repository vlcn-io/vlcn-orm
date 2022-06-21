// SIGNED-SOURCE: <4c7cd6cdf6d89d9329dce79dc2a12121>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { EdgeSpecWithCreate } from "@aphro/runtime-ts";
import { default as PlaylistSpec } from "./PlaylistSpec.js";
import { default as TrackSpec } from "./TrackSpec.js";
import PlaylistTrack from "./PlaylistTrack.js";
import { Data } from "./PlaylistTrack.js";

const spec: EdgeSpecWithCreate<PlaylistTrack, Data> = {
  type: "junction",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(
      (data.id1 + "-" + data.id2) as SID_of<PlaylistTrack>,
      "PlaylistTrack"
    );
    if (existing) {
      return existing;
    }
    const result = new PlaylistTrack(ctx, data);
    ctx.cache.set((data.id1 + "-" + data.id2) as SID_of<PlaylistTrack>, result);
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
};

export default spec;
