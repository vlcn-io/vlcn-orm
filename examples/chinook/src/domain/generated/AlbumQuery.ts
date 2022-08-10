// SIGNED-SOURCE: <09ad3ed7d1232a27cc60ae987c2e497b>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { DerivedQuery } from "@aphro/runtime-ts";
import { QueryFactory } from "@aphro/runtime-ts";
import { modelLoad } from "@aphro/runtime-ts";
import { filter } from "@aphro/runtime-ts";
import { Predicate } from "@aphro/runtime-ts";
import { take } from "@aphro/runtime-ts";
import { orderBy } from "@aphro/runtime-ts";
import { P } from "@aphro/runtime-ts";
import { ModelFieldGetter } from "@aphro/runtime-ts";
import { Expression } from "@aphro/runtime-ts";
import { EmptyQuery } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import Album from "../Album.js";
import { Data } from "./AlbumBase.js";
import AlbumSpec from "./AlbumSpec.js";
import Artist from "../Artist.js";
import ArtistSpec from "./ArtistSpec.js";
import ArtistQuery from "./ArtistQuery.js";
import TrackSpec from "./TrackSpec.js";
import TrackQuery from "./TrackQuery.js";

export default class AlbumQuery extends DerivedQuery<Album> {
  static create(ctx: Context) {
    return new AlbumQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, AlbumSpec),
      modelLoad(ctx, AlbumSpec.createFrom)
    );
  }

  static empty(ctx: Context) {
    return new AlbumQuery(ctx, new EmptyQuery(ctx));
  }

  protected derive(expression: Expression): AlbumQuery {
    return new AlbumQuery(this.ctx, this, expression);
  }

  static fromId(ctx: Context, id: SID_of<Album>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"id", Data, Album>("id"), p)
    );
  }

  whereTitle(p: Predicate<Data["title"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"title", Data, Album>("title"), p)
    );
  }

  whereArtistId(p: Predicate<Data["artistId"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"artistId", Data, Album>("artistId"), p)
    );
  }
  queryArtist(): ArtistQuery {
    return new ArtistQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(
        this.ctx,
        this,
        AlbumSpec.outboundEdges.artist
      ),
      modelLoad(this.ctx, ArtistSpec.createFrom)
    );
  }
  queryTracks(): TrackQuery {
    return new TrackQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(
        this.ctx,
        this,
        AlbumSpec.outboundEdges.tracks
      ),
      modelLoad(this.ctx, TrackSpec.createFrom)
    );
  }

  take(n: number) {
    return new AlbumQuery(this.ctx, this, take(n));
  }

  orderById(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"id", Data, Album>("id"), direction)
    );
  }

  orderByTitle(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"title", Data, Album>("title"), direction)
    );
  }

  orderByArtistId(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"artistId", Data, Album>("artistId"),
        direction
      )
    );
  }
}
