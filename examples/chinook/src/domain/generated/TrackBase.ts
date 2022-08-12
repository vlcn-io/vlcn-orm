// SIGNED-SOURCE: <aef128baf4bac9ba6d3cc872e001b43d>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import Track from "../Track.js";
import { default as s } from "./TrackSpec.js";
import { P } from "@aphro/runtime-ts";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { makeSavable } from "@aphro/runtime-ts";
import { modelGenMemo } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import TrackQuery from "./TrackQuery.js";
import { Context } from "@aphro/runtime-ts";
import AlbumQuery from "./AlbumQuery.js";
import AlbumSpec from "./AlbumSpec.js";
import MediaTypeQuery from "./MediaTypeQuery.js";
import MediaTypeSpec from "./MediaTypeSpec.js";
import GenreQuery from "./GenreQuery.js";
import GenreSpec from "./GenreSpec.js";
import InvoiceLineQuery from "./InvoiceLineQuery.js";
import InvoiceLine from "../InvoiceLine.js";
import Album from "../Album.js";
import MediaType from "../MediaType.js";
import Genre from "../Genre.js";

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

// @Sealed(Track)
export default abstract class TrackBase extends Node<Data> {
  readonly spec = s as unknown as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as unknown as SID_of<this>;
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
    return InvoiceLineQuery.create(this.ctx).whereTrackId(
      P.equals(this.id as any)
    );
  }

  async genAlbum(): Promise<Album | null> {
    const existing = this.ctx.cache.get(
      this.albumId,
      AlbumSpec.storage.db,
      AlbumSpec.storage.tablish
    );
    if (existing != null) {
      return existing;
    }
    return await this.queryAlbum().genOnlyValue();
  }

  async genMediaType(): Promise<MediaType> {
    const existing = this.ctx.cache.get(
      this.mediaTypeId,
      MediaTypeSpec.storage.db,
      MediaTypeSpec.storage.tablish
    );
    if (existing != null) {
      return existing;
    }
    return await this.queryMediaType().genxOnlyValue();
  }

  async genGenre(): Promise<Genre | null> {
    const existing = this.ctx.cache.get(
      this.genreId,
      GenreSpec.storage.db,
      GenreSpec.storage.tablish
    );
    if (existing != null) {
      return existing;
    }
    return await this.queryGenre().genOnlyValue();
  }

  static queryAll(ctx: Context): TrackQuery {
    return TrackQuery.create(ctx);
  }

  static genx = modelGenMemo(
    "chinook",
    "track",
    (ctx: Context, id: SID_of<Track>): Promise<Track> =>
      this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue()
  );

  static gen = modelGenMemo<Track | null>(
    "chinook",
    "track",
    // @ts-ignore #43
    (ctx: Context, id: SID_of<Track>): Promise<Track | null> =>
      this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue()
  );

  update(data: Partial<Data>) {
    return makeSavable(
      this.ctx,
      new UpdateMutationBuilder(this.ctx, this.spec, this)
        .set(data)
        .toChangesets()[0]
    );
  }

  static create(ctx: Context, data: Partial<Data>) {
    return makeSavable(
      ctx,
      new CreateMutationBuilder(ctx, s).set(data).toChangesets()[0]
    );
  }

  delete() {
    return makeSavable(
      this.ctx,
      new DeleteMutationBuilder(this.ctx, this.spec, this).toChangesets()[0]
    );
  }
}
