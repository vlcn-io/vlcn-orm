// SIGNED-SOURCE: <51c0c581156c686d3dc86c4c85ef4693>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { default as s } from "./AlbumSpec.js";
import { P } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import AlbumQuery from "./AlbumQuery.js";
import { Context } from "@aphro/runtime-ts";
import ArtistQuery from "./ArtistQuery.js";
import TrackQuery from "./TrackQuery.js";
import Track from "./Track.js";
import Artist from "./Artist.js";

export type Data = {
  id: SID_of<Album>;
  title: string;
  artistId: SID_of<Artist>;
};

export default class Album extends Node<Data> {
  readonly spec = s as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  get title(): string {
    return this.data.title;
  }

  get artistId(): SID_of<Artist> {
    return this.data.artistId;
  }

  queryArtist(): ArtistQuery {
    return ArtistQuery.fromId(this.ctx, this.artistId);
  }
  queryTracks(): TrackQuery {
    return TrackQuery.create(this.ctx).whereAlbumId(P.equals(this.id));
  }

  static queryAll(ctx: Context): AlbumQuery {
    return AlbumQuery.create(ctx);
  }

  static async genx(ctx: Context, id: SID_of<Album>): Promise<Album> {
    const existing = ctx.cache.get(id, "Album");
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(ctx: Context, id: SID_of<Album>): Promise<Album | null> {
    const existing = ctx.cache.get(id, "Album");
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue();
  }
}
