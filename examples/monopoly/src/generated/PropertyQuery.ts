// SIGNED-SOURCE: <0cc2c40825695a5a277f816b737f6b36>
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
import Property from "./Property.js";
import { Data } from "./Property.js";
import { default as spec } from "./PropertySpec.js";
import Player from "./Player.js";
import Game from "./Game.js";

export default class PropertyQuery extends DerivedQuery<Property> {
  static create(ctx: Context) {
    return new PropertyQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, spec),
      modelLoad(ctx, spec.createFrom)
    );
  }

  static fromId(ctx: Context, id: SID_of<Property>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return new PropertyQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"id", Data, Property>("id"), p)
    );
  }

  whereName(p: Predicate<Data["name"]>) {
    return new PropertyQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"name", Data, Property>("name"), p)
    );
  }

  whereOwnerId(p: Predicate<Data["ownerId"]>) {
    return new PropertyQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"ownerId", Data, Property>("ownerId"), p)
    );
  }

  whereGameId(p: Predicate<Data["gameId"]>) {
    return new PropertyQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"gameId", Data, Property>("gameId"), p)
    );
  }

  whereCost(p: Predicate<Data["cost"]>) {
    return new PropertyQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"cost", Data, Property>("cost"), p)
    );
  }

  whereMortgaged(p: Predicate<Data["mortgaged"]>) {
    return new PropertyQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"mortgaged", Data, Property>("mortgaged"), p)
    );
  }

  whereNumHouses(p: Predicate<Data["numHouses"]>) {
    return new PropertyQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"numHouses", Data, Property>("numHouses"), p)
    );
  }

  whereNumHotels(p: Predicate<Data["numHotels"]>) {
    return new PropertyQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"numHotels", Data, Property>("numHotels"), p)
    );
  }
}
