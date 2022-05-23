// SIGNED-SOURCE: <116128ec4805f9bd9c787a316feb3121>
import { Context } from "@aphro/runtime-ts";
import { DerivedQuery } from "@aphro/runtime-ts";
import { QueryFactory } from "@aphro/runtime-ts";
import { modelLoad } from "@aphro/runtime-ts";
import { filter } from "@aphro/runtime-ts";
import { Predicate } from "@aphro/runtime-ts";
import { P } from "@aphro/runtime-ts";
import { ModelFieldGetter } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
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
  static create(ctx: Context) {
    return new DeckQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, spec),
      modelLoad(ctx, spec.createFrom)
    );
  }

  static fromId(ctx: Context, id: SID_of<Deck>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return new DeckQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"id", Data, Deck>("id"), p)
    );
  }

  whereName(p: Predicate<Data["name"]>) {
    return new DeckQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"name", Data, Deck>("name"), p)
    );
  }

  whereCreated(p: Predicate<Data["created"]>) {
    return new DeckQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"created", Data, Deck>("created"), p)
    );
  }

  whereModified(p: Predicate<Data["modified"]>) {
    return new DeckQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"modified", Data, Deck>("modified"), p)
    );
  }

  whereOwnerId(p: Predicate<Data["ownerId"]>) {
    return new DeckQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"ownerId", Data, Deck>("ownerId"), p)
    );
  }

  whereSelectedSlideId(p: Predicate<Data["selectedSlideId"]>) {
    return new DeckQuery(
      this.ctx,
      this,
      filter(
        new ModelFieldGetter<"selectedSlideId", Data, Deck>("selectedSlideId"),
        p
      )
    );
  }
  queryOwner(): UserQuery {
    return new UserQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(this.ctx, this, spec.outboundEdges.owner),
      modelLoad(this.ctx, UserSpec.createFrom)
    );
  }
  querySlides(): SlideQuery {
    return new SlideQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(this.ctx, this, spec.outboundEdges.slides),
      modelLoad(this.ctx, SlideSpec.createFrom)
    );
  }
  querySelectedSlide(): SlideQuery {
    return new SlideQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(
        this.ctx,
        this,
        spec.outboundEdges.selectedSlide
      ),
      modelLoad(this.ctx, SlideSpec.createFrom)
    );
  }
}
