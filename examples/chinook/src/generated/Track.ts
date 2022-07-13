// SIGNED-SOURCE: <2d430ecc60dcdef36f27d20c251489b7>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { applyMixins } from "@aphro/runtime-ts";
import { default as s } from "./TrackSpec.js";
import { P } from "@aphro/runtime-ts";
import { ManualMethods, manualMethods } from "./TrackManualMethods.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import TrackQuery from "./TrackQuery.js";
import { Context } from "@aphro/runtime-ts";
import AlbumQuery from "./AlbumQuery.js";
import MediaTypeQuery from "./MediaTypeQuery.js";
import GenreQuery from "./GenreQuery.js";
import InvoiceLineQuery from "./InvoiceLineQuery.js";
import InvoiceLine from "./InvoiceLine.js";
import Album from "./Album.js";
import MediaType from "./MediaType.js";
import Genre from "./Genre.js";

export type Data = {
  id: SID_of<Track>;
  name: string;
  albumId: SID_of<Album> | null;
  mediaTypeId: SID_of<MediaType>;
  genreId: SID_of<Genre> | null;
  composer: string | null;
  milliseconds: number;
  bytes: number | null;
  unitPrice: number;
};

class Track extends Node<Data> {
  readonly spec = s as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  get name(): string {
    return this.data.name;
  }

  get albumId(): SID_of<Album> | null {
    return this.data.albumId;
  }

  get mediaTypeId(): SID_of<MediaType> {
    return this.data.mediaTypeId;
  }

  get genreId(): SID_of<Genre> | null {
    return this.data.genreId;
  }

  get composer(): string | null {
    return this.data.composer;
  }

  get milliseconds(): number {
    return this.data.milliseconds;
  }

  get bytes(): number | null {
    return this.data.bytes;
  }

  get unitPrice(): number {
    return this.data.unitPrice;
  }

  queryAlbum(): AlbumQuery {
    if (this.albumId == null) {
      return AlbumQuery.empty(this.ctx);
    }
    return AlbumQuery.fromId(this.ctx, this.albumId);
  }
  queryMediaType(): MediaTypeQuery {
    return MediaTypeQuery.fromId(this.ctx, this.mediaTypeId);
  }
  queryGenre(): GenreQuery {
    if (this.genreId == null) {
      return GenreQuery.empty(this.ctx);
    }
    return GenreQuery.fromId(this.ctx, this.genreId);
  }
  queryInvoiceLines(): InvoiceLineQuery {
    return InvoiceLineQuery.create(this.ctx).whereTrackId(P.equals(this.id));
  }

  static queryAll(ctx: Context): TrackQuery {
    return TrackQuery.create(ctx);
  }

  static async genx(ctx: Context, id: SID_of<Track>): Promise<Track> {
    const existing = ctx.cache.get(id, Track.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(ctx: Context, id: SID_of<Track>): Promise<Track | null> {
    const existing = ctx.cache.get(id, Track.name);
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

interface Track extends ManualMethods {}
applyMixins(Track, [manualMethods]);
export default Track;
