// SIGNED-SOURCE: <f6a56c615cb6f2a5ff61c10841c1e9c1>
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
import PlaylistTrack from "./PlaylistTrack.js";
import { Data } from "./PlaylistTrack.js";
import { default as spec } from "./PlaylistTrackSpec.js";
import Playlist from "./Playlist.js";
import Track from "./Track.js";

export default class PlaylistTrackQuery extends DerivedQuery<PlaylistTrack> {
  static create(ctx: Context) {
    return new PlaylistTrackQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, spec),
      modelLoad(ctx, spec.createFrom)
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
      filter(new ModelFieldGetter<"id1", Data, PlaylistTrack>("id1"), p)
    );
  }

  whereId2(p: Predicate<Data["id2"]>) {
    return this.derive(
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
