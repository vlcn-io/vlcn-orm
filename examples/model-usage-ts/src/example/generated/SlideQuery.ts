// SIGNED-SOURCE: <ce2659133a466b6b536094f2ff87b632>
import {
  DerivedQuery,
  QueryFactory,
  modelLoad,
  filter,
  Predicate,
  P,
  ModelFieldGetter,
} from "@aphro/query-runtime-ts";
import { SID_of } from "@strut/sid";
import Slide, { Data, spec } from "./Slide.js";
import Slid from "./Slid.js";
import Deck from "./Deck.js";
import { spec as ComponentSpec } from "./Component";
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
      QueryFactory.createHopQueryFor(this, spec, ComponentSpec),
      modelLoad(ComponentSpec.createFrom)
    ).whereSlideId(P.equals(this.id));
  }
}
