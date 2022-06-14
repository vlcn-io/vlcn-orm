// SIGNED-SOURCE: <75b752e6dee36e82c248c680c0d270ed>
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
import { P } from "@aphro/runtime-ts";
import { ModelFieldGetter } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import Player from "./Player.js";
import { Data } from "./Player.js";
import { default as spec } from "./PlayerSpec.js";
import Person from "./Person.js";
import Game from "./Game.js";
import { default as PropertySpec } from "./PropertySpec.js";
import PropertyQuery from "./PropertyQuery.js";
import { default as GameSpec } from "./GameSpec.js";
import GameQuery from "./GameQuery.js";
import { default as PersonSpec } from "./PersonSpec.js";
import PersonQuery from "./PersonQuery.js";

export default class PlayerQuery extends DerivedQuery<Player> {
  static create(ctx: Context) {
    return new PlayerQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, spec),
      modelLoad(ctx, spec.createFrom)
    );
  }

  static fromId(ctx: Context, id: SID_of<Player>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return new PlayerQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"id", Data, Player>("id"), p)
    );
  }

  wherePiece(p: Predicate<Data["piece"]>) {
    return new PlayerQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"piece", Data, Player>("piece"), p)
    );
  }

  whereOwnerId(p: Predicate<Data["ownerId"]>) {
    return new PlayerQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"ownerId", Data, Player>("ownerId"), p)
    );
  }

  whereGameId(p: Predicate<Data["gameId"]>) {
    return new PlayerQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"gameId", Data, Player>("gameId"), p)
    );
  }
  queryProperties(): PropertyQuery {
    return new PropertyQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(
        this.ctx,
        this,
        spec.outboundEdges.properties
      ),
      modelLoad(this.ctx, PropertySpec.createFrom)
    );
  }
  queryPlaying(): GameQuery {
    return new GameQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(
        this.ctx,
        this,
        spec.outboundEdges.playing
      ),
      modelLoad(this.ctx, GameSpec.createFrom)
    );
  }
  queryOwner(): PersonQuery {
    return new PersonQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(this.ctx, this, spec.outboundEdges.owner),
      modelLoad(this.ctx, PersonSpec.createFrom)
    );
  }
}
