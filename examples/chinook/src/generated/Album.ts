// SIGNED-SOURCE: <da2aafbd5575f09d6d9900894c76b2e2>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { applyMixins } from "@aphro/runtime-ts";
import { default as s } from "./AlbumSpec.js";
import { P } from "@aphro/runtime-ts";
import { ManualMethods, manualMethods } from "./AlbumManualMethods.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
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

class Album extends Node<Data> {
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
    const existing = ctx.cache.get(id, Album.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(ctx: Context, id: SID_of<Album>): Promise<Album | null> {
    const existing = ctx.cache.get(id, Album.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue();
  }

  update(data: Partial<Data>) {
    return new UpdateMutationBuilder(this.ctx, this.spec, this)
      .set(data)
      .toChangeset();
  }

  static create(ctx: Context, data: Partial<Data>) {
    return new CreateMutationBuilder(ctx, s).set(data).toChangeset();
  }

  delete() {
    return new DeleteMutationBuilder(this.ctx, s, this).toChangeset();
  }
}

interface Album extends ManualMethods {}
applyMixins(Album, [manualMethods]);
export default Album;
