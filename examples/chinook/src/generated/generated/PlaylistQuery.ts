// SIGNED-SOURCE: <39cd3d4e37c9de0372acbb2aba43f9b4>
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
import Playlist from "../Playlist.js";
import { Data } from "./PlaylistBase.js";
import { default as spec } from "./PlaylistSpec.js";
import { default as TrackSpec } from "./TrackSpec.js";
import TrackQuery from "./TrackQuery.js";

export default class PlaylistQuery extends DerivedQuery<Playlist> {
  static create(ctx: Context) {
    return new PlaylistQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, spec),
      modelLoad(ctx, spec.createFrom)
    );
  }

  static empty(ctx: Context) {
    return new PlaylistQuery(ctx, new EmptyQuery(ctx));
  }

  protected derive(expression: Expression): PlaylistQuery {
    return new PlaylistQuery(this.ctx, this, expression);
  }

  static fromId(ctx: Context, id: SID_of<Playlist>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"id", Data, Playlist>("id"), p)
    );
  }

  whereName(p: Predicate<Data["name"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"name", Data, Playlist>("name"), p)
    );
  }
  queryTracks(): TrackQuery {
    return new TrackQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(this.ctx, this, spec.outboundEdges.tracks),
      modelLoad(this.ctx, TrackSpec.createFrom)
    );
  }

  take(n: number) {
    return new PlaylistQuery(this.ctx, this, take(n));
  }

  orderById(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"id", Data, Playlist>("id"), direction)
    );
  }

  orderByName(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"name", Data, Playlist>("name"), direction)
    );
  }
}
