// SIGNED-SOURCE: <07fc3fad56fa3c7aa926bdb3fa0fe202>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { default as s } from "./ArtistSpec.js";
import { P } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import ArtistQuery from "./ArtistQuery.js";
import { Context } from "@aphro/runtime-ts";
import albumQuery from "./albumQuery.js";
import album from "./album.js";

export type Data = {
  id: SID_of<Artist>;
  name: string | null;
};

export default class Artist extends Node<Data> {
  readonly spec = s as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  get name(): string | null {
    return this.data.name;
  }

  queryAlbums(): albumQuery {
    return albumQuery.create(this.ctx).whereArtistId(P.equals(this.id));
  }

  static queryAll(ctx: Context): ArtistQuery {
    return ArtistQuery.create(ctx);
  }

  static async genx(ctx: Context, id: SID_of<Artist>): Promise<Artist> {
    const existing = ctx.cache.get(id, Artist.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(ctx: Context, id: SID_of<Artist>): Promise<Artist | null> {
    const existing = ctx.cache.get(id, Artist.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue();
  }
}
