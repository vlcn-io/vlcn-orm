// SIGNED-SOURCE: <4688f5b2d6df6462f9b513a10e675e01>
import { Context } from "@aphro/context-runtime-ts";
import { DerivedQuery } from "@aphro/query-runtime-ts";
import { QueryFactory } from "@aphro/query-runtime-ts";
import { modelLoad } from "@aphro/query-runtime-ts";
import { filter } from "@aphro/query-runtime-ts";
import { Predicate } from "@aphro/query-runtime-ts";
import { P } from "@aphro/query-runtime-ts";
import { ModelFieldGetter } from "@aphro/query-runtime-ts";
import { SID_of } from "@strut/sid";
import Slide from "./Slide.js";
import { Data } from "./Slide.js";
import { default as spec } from "./SlideSpec.js";
import Deck from "./Deck.js";
import { default as ComponentSpec } from "./ComponentSpec.js";
import ComponentQuery from "./ComponentQuery";

export default class SlideQuery extends DerivedQuery<Slide> {
  static create(ctx: Context) {
    return new SlideQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, spec),
      modelLoad(ctx, spec.createFrom)
    );
  }

  static fromId(ctx: Context, id: SID_of<Slide>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return new SlideQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"id", Data, Slide>("id"), p)
    );
  }

  whereDeckId(p: Predicate<Data["deckId"]>) {
    return new SlideQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"deckId", Data, Slide>("deckId"), p)
    );
  }

  whereOrder(p: Predicate<Data["order"]>) {
    return new SlideQuery(
      this.ctx,
      this,
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
}
