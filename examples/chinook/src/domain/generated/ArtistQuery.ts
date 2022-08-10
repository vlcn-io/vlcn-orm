// SIGNED-SOURCE: <d5d5988543c6ae229db5d4ca70cdb066>
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
import Artist from "../Artist.js";
import { Data } from "./ArtistBase.js";
import ArtistSpec from "./ArtistSpec.js";
import albumSpec from "./albumSpec.js";
import albumQuery from "./albumQuery.js";

export default class ArtistQuery extends DerivedQuery<Artist> {
  static create(ctx: Context) {
    return new ArtistQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, ArtistSpec),
      modelLoad(ctx, ArtistSpec.createFrom)
    );
  }

  static empty(ctx: Context) {
    return new ArtistQuery(ctx, new EmptyQuery(ctx));
  }

  protected derive(expression: Expression): ArtistQuery {
    return new ArtistQuery(this.ctx, this, expression);
  }

  static fromId(ctx: Context, id: SID_of<Artist>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"id", Data, Artist>("id"), p)
    );
  }

  whereName(p: Predicate<Data["name"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"name", Data, Artist>("name"), p)
    );
  }
  queryAlbums(): albumQuery {
    return new albumQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(
        this.ctx,
        this,
        ArtistSpec.outboundEdges.albums
      ),
      modelLoad(this.ctx, albumSpec.createFrom)
    );
  }

  take(n: number) {
    return new ArtistQuery(this.ctx, this, take(n));
  }

  orderById(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"id", Data, Artist>("id"), direction)
    );
  }

  orderByName(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"name", Data, Artist>("name"), direction)
    );
  }
}
