// SIGNED-SOURCE: <79053a9b65e9a808466ce5f347cf3d44>
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
import Slide from "../Slide.js";
import { Data } from "./SlideBase.js";
import SlideSpec from "./SlideSpec.js";
import Deck from "../Deck.js";
import ComponentSpec from "./ComponentSpec.js";
import ComponentQuery from "./ComponentQuery.js";

export default class SlideQuery extends DerivedQuery<Slide> {
  static create(ctx: Context) {
    return new SlideQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, SlideSpec),
      modelLoad(ctx, SlideSpec.createFrom)
    );
  }

  static empty(ctx: Context) {
    return new SlideQuery(ctx, new EmptyQuery(ctx));
  }

  protected derive(expression: Expression): SlideQuery {
    return new SlideQuery(this.ctx, this, expression);
  }

  static fromId(ctx: Context, id: SID_of<Slide>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"id", Data, Slide>("id"), p)
    );
  }

  whereDeckId(p: Predicate<Data["deckId"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"deckId", Data, Slide>("deckId"), p)
    );
  }

  whereOrder(p: Predicate<Data["order"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"order", Data, Slide>("order"), p)
    );
  }
  queryComponents(): ComponentQuery {
    return new ComponentQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(
        this.ctx,
        this,
        SlideSpec.outboundEdges.components
      ),
      modelLoad(this.ctx, ComponentSpec.createFrom)
    );
  }

  take(n: number) {
    return new SlideQuery(this.ctx, this, take(n));
  }

  orderById(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"id", Data, Slide>("id"), direction)
    );
  }

  orderByDeckId(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"deckId", Data, Slide>("deckId"), direction)
    );
  }

  orderByOrder(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"order", Data, Slide>("order"), direction)
    );
  }
}
