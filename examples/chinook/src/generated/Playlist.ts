// SIGNED-SOURCE: <128f671ba086bb845bd0ecff65a262bb>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { default as s } from "./PlaylistSpec.js";
import { P } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import PlaylistQuery from "./PlaylistQuery.js";
import { Context } from "@aphro/runtime-ts";
import TrackQuery from "./TrackQuery.js";

export type Data = {
  id: SID_of<Playlist>;
  name: string;
};

export default class Playlist extends Node<Data> {
  readonly spec = s as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  get name(): string {
    return this.data.name;
  }

  queryTracks(): TrackQuery {
    return PlaylistQuery.fromId(this.ctx, this.id).queryTracks();
  }

  static queryAll(ctx: Context): PlaylistQuery {
    return PlaylistQuery.create(ctx);
  }

  static async genx(ctx: Context, id: SID_of<Playlist>): Promise<Playlist> {
    const existing = ctx.cache.get(id, "Playlist");
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(
    ctx: Context,
    id: SID_of<Playlist>
  ): Promise<Playlist | null> {
    const existing = ctx.cache.get(id, "Playlist");
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue();
  }
}
