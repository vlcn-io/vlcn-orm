// SIGNED-SOURCE: <7f86f023817a8b055a290071f9dc1257>
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
import Game from "./Game.js";
import { Data } from "./Game.js";
import { default as spec } from "./GameSpec.js";
import { default as PlayerSpec } from "./PlayerSpec.js";
import PlayerQuery from "./PlayerQuery.js";
import { default as PropertySpec } from "./PropertySpec.js";
import PropertyQuery from "./PropertyQuery.js";

export default class GameQuery extends DerivedQuery<Game> {
  static create(ctx: Context) {
    return new GameQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, spec),
      modelLoad(ctx, spec.createFrom)
    );
  }

  static fromId(ctx: Context, id: SID_of<Game>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return new GameQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"id", Data, Game>("id"), p)
    );
  }

  whereName(p: Predicate<Data["name"]>) {
    return new GameQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"name", Data, Game>("name"), p)
    );
  }
  queryPlayers(): PlayerQuery {
    return new PlayerQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(
        this.ctx,
        this,
        spec.outboundEdges.players
      ),
      modelLoad(this.ctx, PlayerSpec.createFrom)
    );
  }
  queryBoard(): PropertyQuery {
    return new PropertyQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(this.ctx, this, spec.outboundEdges.board),
      modelLoad(this.ctx, PropertySpec.createFrom)
    );
  }
}
