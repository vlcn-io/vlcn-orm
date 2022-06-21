// SIGNED-SOURCE: <57c4169f4998b79150909c77abd1141b>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
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
import Track from "./Track.js";
import { Data } from "./Track.js";
import { default as spec } from "./TrackSpec.js";
import Album from "./Album.js";
import MediaType from "./MediaType.js";
import Genre from "./Genre.js";
import { default as AlbumSpec } from "./AlbumSpec.js";
import AlbumQuery from "./AlbumQuery.js";
import { default as MediaTypeSpec } from "./MediaTypeSpec.js";
import MediaTypeQuery from "./MediaTypeQuery.js";
import { default as GenreSpec } from "./GenreSpec.js";
import GenreQuery from "./GenreQuery.js";
import { default as InvoiceLineSpec } from "./InvoiceLineSpec.js";
import InvoiceLineQuery from "./InvoiceLineQuery.js";

export default class TrackQuery extends DerivedQuery<Track> {
  static create(ctx: Context) {
    return new TrackQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, spec),
      modelLoad(ctx, spec.createFrom)
    );
  }

  static empty(ctx: Context) {
    return new TrackQuery(ctx, new EmptyQuery(ctx));
  }

  protected derive(expression: Expression): TrackQuery {
    return new TrackQuery(this.ctx, this, expression);
  }

  static fromId(ctx: Context, id: SID_of<Track>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"id", Data, Track>("id"), p)
    );
  }

  whereName(p: Predicate<Data["name"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"name", Data, Track>("name"), p)
    );
  }

  whereAlbumId(p: Predicate<Data["albumId"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"albumId", Data, Track>("albumId"), p)
    );
  }

  whereMediaTypeId(p: Predicate<Data["mediaTypeId"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"mediaTypeId", Data, Track>("mediaTypeId"), p)
    );
  }

  whereGenreId(p: Predicate<Data["genreId"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"genreId", Data, Track>("genreId"), p)
    );
  }

  whereComposter(p: Predicate<Data["composter"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"composter", Data, Track>("composter"), p)
    );
  }

  whereMilliseconds(p: Predicate<Data["milliseconds"]>) {
    return this.derive(
      filter(
        new ModelFieldGetter<"milliseconds", Data, Track>("milliseconds"),
        p
      )
    );
  }

  whereBytes(p: Predicate<Data["bytes"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"bytes", Data, Track>("bytes"), p)
    );
  }

  wherePrice(p: Predicate<Data["price"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"price", Data, Track>("price"), p)
    );
  }
  queryAlbum(): AlbumQuery {
    return new AlbumQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(this.ctx, this, spec.outboundEdges.album),
      modelLoad(this.ctx, AlbumSpec.createFrom)
    );
  }
  queryMediaType(): MediaTypeQuery {
    return new MediaTypeQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(
        this.ctx,
        this,
        spec.outboundEdges.mediaType
      ),
      modelLoad(this.ctx, MediaTypeSpec.createFrom)
    );
  }
  queryGenre(): GenreQuery {
    return new GenreQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(this.ctx, this, spec.outboundEdges.genre),
      modelLoad(this.ctx, GenreSpec.createFrom)
    );
  }
  queryInvoiceLines(): InvoiceLineQuery {
    return new InvoiceLineQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(
        this.ctx,
        this,
        spec.outboundEdges.invoiceLines
      ),
      modelLoad(this.ctx, InvoiceLineSpec.createFrom)
    );
  }

  take(n: number) {
    return new TrackQuery(this.ctx, this, take(n));
  }

  orderById(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"id", Data, Track>("id"), direction)
    );
  }

  orderByName(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"name", Data, Track>("name"), direction)
    );
  }

  orderByAlbumId(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"albumId", Data, Track>("albumId"),
        direction
      )
    );
  }

  orderByMediaTypeId(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"mediaTypeId", Data, Track>("mediaTypeId"),
        direction
      )
    );
  }

  orderByGenreId(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"genreId", Data, Track>("genreId"),
        direction
      )
    );
  }

  orderByComposter(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"composter", Data, Track>("composter"),
        direction
      )
    );
  }

  orderByMilliseconds(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"milliseconds", Data, Track>("milliseconds"),
        direction
      )
    );
  }

  orderByBytes(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"bytes", Data, Track>("bytes"), direction)
    );
  }

  orderByPrice(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"price", Data, Track>("price"), direction)
    );
  }
}
