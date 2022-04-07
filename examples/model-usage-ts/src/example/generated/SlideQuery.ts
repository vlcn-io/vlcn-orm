// SIGNED-SOURCE: <2b722aab1843e39e6d63bce469d9e272>
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
import { spec } from "./Slide.js";
import Deck from "./Deck.js";
import { default as ComponentSpec } from "./ComponentSpec.js";
import ComponentQuery from "./ComponentQuery";

export default class SlideQuery extends DerivedQuery<Slide> {
  static create() {
    return new SlideQuery(
      QueryFactory.createSourceQueryFor(spec),
      modelLoad(spec.createFrom)
    );
  }

  static fromId(id: SID_of<Slide>) {
    return this.create().whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return new SlideQuery(
      this,
      filter(new ModelFieldGetter<"id", Data, Slide>("id"), p)
    );
  }

  whereDeckId(p: Predicate<Data["deckId"]>) {
    return new SlideQuery(
      this,
      filter(new ModelFieldGetter<"deckId", Data, Slide>("deckId"), p)
    );
  }

  whereOrder(p: Predicate<Data["order"]>) {
    return new SlideQuery(
      this,
      filter(new ModelFieldGetter<"order", Data, Slide>("order"), p)
    );
  }
  queryComponents(): ComponentQuery {
    return new ComponentQuery(
      QueryFactory.createHopQueryFor(this, spec.outboundEdges.components),
      modelLoad(ComponentSpec.createFrom)
    );
  }
}
