// SIGNED-SOURCE: <cb12f99597624c29a0a239beb404b0e1>
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
import { OptimisticPromise } from "@aphro/runtime-ts";
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

  genAlbum(): OptimisticPromise<Album | null> {
    const existing = this.ctx.cache.get(
      this.albumId,
      AlbumSpec.storage.db,
      AlbumSpec.storage.tablish
    );
    if (existing != null) {
      const ret = new OptimisticPromise<Album | null>((resolve) =>
        resolve(existing)
      );
      ret.__setOptimisticResult(existing);
      return ret;
    }
    return new OptimisticPromise((resolve, reject) =>
      this.queryAlbum().genOnlyValue().then(resolve, reject)
    );
  }

  genMediaType(): OptimisticPromise<MediaType> {
    const existing = this.ctx.cache.get(
      this.mediaTypeId,
      MediaTypeSpec.storage.db,
      MediaTypeSpec.storage.tablish
    );
    if (existing != null) {
      const ret = new OptimisticPromise<MediaType>((resolve) =>
        resolve(existing)
      );
      ret.__setOptimisticResult(existing);
      return ret;
    }
    return new OptimisticPromise((resolve, reject) =>
      this.queryMediaType().genxOnlyValue().then(resolve, reject)
    );
  }

  genGenre(): OptimisticPromise<Genre | null> {
    const existing = this.ctx.cache.get(
      this.genreId,
      GenreSpec.storage.db,
      GenreSpec.storage.tablish
    );
    if (existing != null) {
      const ret = new OptimisticPromise<Genre | null>((resolve) =>
        resolve(existing)
      );
      ret.__setOptimisticResult(existing);
      return ret;
    }
    return new OptimisticPromise((resolve, reject) =>
      this.queryGenre().genOnlyValue().then(resolve, reject)
    );
  }

  static queryAll(ctx: Context): TrackQuery {
    return TrackQuery.create(ctx);
  }

  static async genx(ctx: Context, id: SID_of<Track>): Promise<Track> {
    const existing = ctx.cache.get(id, "chinook", "track");
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(ctx: Context, id: SID_of<Track>): Promise<Track | null> {
    const existing = ctx.cache.get(id, "chinook", "track");
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
    return new DeleteMutationBuilder(this.ctx, this.spec, this).toChangeset();
  }
}
