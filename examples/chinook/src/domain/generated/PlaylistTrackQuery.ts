// SIGNED-SOURCE: <c50585432086d029c6fd6254a903d4e1>
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
import PlaylistTrack from "../PlaylistTrack.js";
import { Data } from "./PlaylistTrackBase.js";
import PlaylistTrackSpec from "./PlaylistTrackSpec.js";
import Playlist from "../Playlist.js";
import Track from "../Track.js";

export default class PlaylistTrackQuery extends DerivedQuery<PlaylistTrack> {
  static create(ctx: Context) {
    return new PlaylistTrackQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, PlaylistTrackSpec),
      modelLoad(ctx, PlaylistTrackSpec.createFrom)
    );
  }

  static empty(ctx: Context) {
    return new PlaylistTrackQuery(ctx, new EmptyQuery(ctx));
  }

  protected derive(expression: Expression): PlaylistTrackQuery {
    return new PlaylistTrackQuery(this.ctx, this, expression);
  }

  whereId1(p: Predicate<Data["id1"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"id1", Data, PlaylistTrack>("id1"), p)
    );
  }

  whereId2(p: Predicate<Data["id2"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"id2", Data, PlaylistTrack>("id2"), p)
    );
  }

  take(n: number) {
    return new PlaylistTrackQuery(this.ctx, this, take(n));
  }

  orderById1(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"id1", Data, PlaylistTrack>("id1"),
        direction
      )
    );
  }

  orderById2(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"id2", Data, PlaylistTrack>("id2"),
        direction
      )
    );
  }
}
