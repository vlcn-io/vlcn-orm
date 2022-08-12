// SIGNED-SOURCE: <325da7a082057d47cbfc76d23e75ad10>
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
import { makeSavable } from "@aphro/runtime-ts";
import { modelGenMemo } from "@aphro/runtime-ts";
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
import AlbumMutations from "./AlbumMutations.js";

declare type Muts = typeof AlbumMutations;

export type Data = {
  id: SID_of<Album>;
  title: string;
  artistId: SID_of<Artist>;
};

// @Sealed(Album)
export default abstract class AlbumBase extends Node<Data> {
  readonly spec = s as unknown as NodeSpecWithCreate<this, Data>;

  static get mutations(): Muts {
    return AlbumMutations;
  }

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

  async genArtist(): Promise<Artist> {
    const existing = this.ctx.cache.get(
      this.artistId,
      ArtistSpec.storage.db,
      ArtistSpec.storage.tablish
    );
    if (existing != null) {
      return existing;
    }
    return await this.queryArtist().genxOnlyValue();
  }

  static queryAll(ctx: Context): AlbumQuery {
    return AlbumQuery.create(ctx);
  }

  static genx = modelGenMemo(
    "chinook",
    "album",
    (ctx: Context, id: SID_of<Album>): Promise<Album> =>
      this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue()
  );

  static gen = modelGenMemo<Album | null>(
    "chinook",
    "album",
    // @ts-ignore #43
    (ctx: Context, id: SID_of<Album>): Promise<Album | null> =>
      this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue()
  );

  delete() {
    return makeSavable(
      this.ctx,
      new DeleteMutationBuilder(this.ctx, this.spec, this).toChangesets()[0]
    );
  }
}
