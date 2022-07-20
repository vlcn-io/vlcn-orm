// SIGNED-SOURCE: <5afa926dc6d20324be1ea212e0b9394c>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import Album from "../Album.js";
import { default as s } from "./AlbumSpec.js";
import { P } from "@aphro/runtime-ts";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { OptimisticPromise } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import AlbumQuery from "./AlbumQuery.js";
import { Context } from "@aphro/runtime-ts";
import ArtistQuery from "./ArtistQuery.js";
import ArtistSpec from "./ArtistSpec.js";
import TrackQuery from "./TrackQuery.js";
import Track from "../Track.js";
import Artist from "../Artist.js";

export type Data = {
  id: SID_of<Album>;
  title: string;
  artistId: SID_of<Artist>;
};

// @Sealed(Album)
export default abstract class AlbumBase extends Node<Data> {
  readonly spec = s as unknown as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as unknown as SID_of<this>;
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
    return TrackQuery.create(this.ctx).whereAlbumId(P.equals(this.id as any));
  }

  genArtist(): OptimisticPromise<Artist> {
    const existing = this.ctx.cache.get(
      this.artistId,
      ArtistSpec.storage.db,
      ArtistSpec.storage.tablish
    );
    if (existing != null) {
      const ret = new OptimisticPromise<Artist>((resolve) => resolve(existing));
      ret.__setOptimisticResult(existing);
      return ret;
    }
    return new OptimisticPromise((resolve, reject) =>
      this.queryArtist().genxOnlyValue().then(resolve, reject)
    );
  }

  static queryAll(ctx: Context): AlbumQuery {
    return AlbumQuery.create(ctx);
  }

  static async genx(ctx: Context, id: SID_of<Album>): Promise<Album> {
    const existing = ctx.cache.get(id, "chinook", "album");
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(ctx: Context, id: SID_of<Album>): Promise<Album | null> {
    const existing = ctx.cache.get(id, "chinook", "album");
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
