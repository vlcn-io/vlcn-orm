// SIGNED-SOURCE: <e0fe5e6711f0137058aebc22b4eb524c>
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
import { SID_of } from "@aphro/runtime-ts";
import Slide from "./Slide.js";
import { Data } from "./Slide.js";
import { default as spec } from "./SlideSpec.js";
import Deck from "./Deck.js";
import { default as ComponentSpec } from "./ComponentSpec.js";
import ComponentQuery from "./ComponentQuery.js";

export default class SlideQuery extends DerivedQuery<Slide> {
  static create(ctx: Context) {
    return new SlideQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, spec),
      modelLoad(ctx, spec.createFrom)
    );
  }

  protected derive(expression: Expression): SlideQuery {
    return new SlideQuery(this.ctx, this, expression);
  }

  static fromId(ctx: Context, id: SID_of<Slide>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"id", Data, Slide>("id"), p)
    );
  }

  whereDeckId(p: Predicate<Data["deckId"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"deckId", Data, Slide>("deckId"), p)
    );
  }

  whereOrder(p: Predicate<Data["order"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"order", Data, Slide>("order"), p)
    );
  }
  queryComponents(): ComponentQuery {
    return new ComponentQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(
        this.ctx,
        this,
        spec.outboundEdges.components
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
