// SIGNED-SOURCE: <ef448b6bbeb9eedc796ddc73a353c2bb>
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
import Deck, { Data, spec } from "./Deck.js";
import Deck from "./Deck.js";
import User from "./User.js";
import Slide from "./Slide.js";
import { spec as UserSpec } from "./User";
import UserQuery from "./UserQuery";
import { spec as SlideSpec } from "./Slide";
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

  whereSelectedSlide(p: Predicate<Data["selectedSlide"]>) {
    return new DeckQuery(
      this,
      filter(
        new ModelFieldGetter<"selectedSlide", Data, Deck>("selectedSlide"),
        p
      )
    );
  }
  queryOwner(): UserQuery {
    return new UserQuery(
      QueryFactory.createHopQueryFor(this, spec, UserSpec),
      modelLoad(UserSpec.createFrom)
    ).whereId(P.equals(this.ownerId));
  }
  querySlides(): SlideQuery {
    return new SlideQuery(
      QueryFactory.createHopQueryFor(this, spec, SlideSpec),
      modelLoad(SlideSpec.createFrom)
    ).whereDeckId(P.equals(this.id));
  }
}
