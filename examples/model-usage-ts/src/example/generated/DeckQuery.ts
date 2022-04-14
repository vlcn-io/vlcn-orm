// SIGNED-SOURCE: <e8cd9cbcf31a62bd713b59f3eb0087a9>
import { DerivedQuery } from "@aphro/query-runtime-ts";
import { QueryFactory } from "@aphro/query-runtime-ts";
import { modelLoad } from "@aphro/query-runtime-ts";
import { filter } from "@aphro/query-runtime-ts";
import { Predicate } from "@aphro/query-runtime-ts";
import { P } from "@aphro/query-runtime-ts";
import { ModelFieldGetter } from "@aphro/query-runtime-ts";
import { SID_of } from "@strut/sid";
import Deck from "./Deck.js";
import { Data } from "./Deck.js";
import { default as spec } from "./DeckSpec.js";
import User from "./User.js";
import Slide from "./Slide.js";
import { default as UserSpec } from "./UserSpec.js";
import UserQuery from "./UserQuery";
import { default as SlideSpec } from "./SlideSpec.js";
import SlideQuery from "./SlideQuery";

export default class DeckQuery extends DerivedQuery<Deck> {
  static create() {
    return new DeckQuery(
      QueryFactory.createSourceQueryFor(spec),
      modelLoad(spec.createFrom)
    );
  }

  static fromId(id: SID_of<Deck>) {
    return this.create().whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return new DeckQuery(
      this,
      filter(new ModelFieldGetter<"id", Data, Deck>("id"), p)
    );
  }

  whereName(p: Predicate<Data["name"]>) {
    return new DeckQuery(
      this,
      filter(new ModelFieldGetter<"name", Data, Deck>("name"), p)
    );
  }

  whereCreated(p: Predicate<Data["created"]>) {
    return new DeckQuery(
      this,
      filter(new ModelFieldGetter<"created", Data, Deck>("created"), p)
    );
  }

  whereModified(p: Predicate<Data["modified"]>) {
    return new DeckQuery(
      this,
      filter(new ModelFieldGetter<"modified", Data, Deck>("modified"), p)
    );
  }

  whereOwnerId(p: Predicate<Data["ownerId"]>) {
    return new DeckQuery(
      this,
      filter(new ModelFieldGetter<"ownerId", Data, Deck>("ownerId"), p)
    );
  }

  whereSelectedSlideId(p: Predicate<Data["selectedSlideId"]>) {
    return new DeckQuery(
      this,
      filter(
        new ModelFieldGetter<"selectedSlideId", Data, Deck>("selectedSlideId"),
        p
      )
    );
  }
  queryOwner(): UserQuery {
    return new UserQuery(
      QueryFactory.createHopQueryFor(this, spec.outboundEdges.owner),
      modelLoad(UserSpec.createFrom)
    );
  }
  querySlides(): SlideQuery {
    return new SlideQuery(
      QueryFactory.createHopQueryFor(this, spec.outboundEdges.slides),
      modelLoad(SlideSpec.createFrom)
    );
  }
  querySelectedSlide(): SlideQuery {
    return new SlideQuery(
      QueryFactory.createHopQueryFor(this, spec.outboundEdges.selectedSlide),
      modelLoad(SlideSpec.createFrom)
    );
  }
}
