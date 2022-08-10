// SIGNED-SOURCE: <0c7029d7781c7e063daa5d4c0565566e>
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
import Genre from "../Genre.js";
import { Data } from "./GenreBase.js";
import GenreSpec from "./GenreSpec.js";
import TrackSpec from "./TrackSpec.js";
import TrackQuery from "./TrackQuery.js";

export default class GenreQuery extends DerivedQuery<Genre> {
  static create(ctx: Context) {
    return new GenreQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, GenreSpec),
      modelLoad(ctx, GenreSpec.createFrom)
    );
  }

  static empty(ctx: Context) {
    return new GenreQuery(ctx, new EmptyQuery(ctx));
  }

  protected derive(expression: Expression): GenreQuery {
    return new GenreQuery(this.ctx, this, expression);
  }

  static fromId(ctx: Context, id: SID_of<Genre>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"id", Data, Genre>("id"), p)
    );
  }

  whereName(p: Predicate<Data["name"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"name", Data, Genre>("name"), p)
    );
  }
  queryTracks(): TrackQuery {
    return new TrackQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(
        this.ctx,
        this,
        GenreSpec.outboundEdges.tracks
      ),
      modelLoad(this.ctx, TrackSpec.createFrom)
    );
  }

  take(n: number) {
    return new GenreQuery(this.ctx, this, take(n));
  }

  orderById(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"id", Data, Genre>("id"), direction)
    );
  }

  orderByName(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"name", Data, Genre>("name"), direction)
    );
  }
}
