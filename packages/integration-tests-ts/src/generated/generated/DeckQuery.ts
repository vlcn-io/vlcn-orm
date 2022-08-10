// SIGNED-SOURCE: <e5fe2fa47182addc41f31de45500fab0>
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
import Deck from "../Deck.js";
import { Data } from "./DeckBase.js";
import DeckSpec from "./DeckSpec.js";
import User from "../User.js";
import Slide from "../Slide.js";
import UserSpec from "./UserSpec.js";
import UserQuery from "./UserQuery.js";
import SlideSpec from "./SlideSpec.js";
import SlideQuery from "./SlideQuery.js";

export default class DeckQuery extends DerivedQuery<Deck> {
  static create(ctx: Context) {
    return new DeckQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, DeckSpec),
      modelLoad(ctx, DeckSpec.createFrom)
    );
  }

  static empty(ctx: Context) {
    return new DeckQuery(ctx, new EmptyQuery(ctx));
  }

  protected derive(expression: Expression): DeckQuery {
    return new DeckQuery(this.ctx, this, expression);
  }

  static fromId(ctx: Context, id: SID_of<Deck>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"id", Data, Deck>("id"), p)
    );
  }

  whereName(p: Predicate<Data["name"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"name", Data, Deck>("name"), p)
    );
  }

  whereCreated(p: Predicate<Data["created"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"created", Data, Deck>("created"), p)
    );
  }

  whereModified(p: Predicate<Data["modified"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"modified", Data, Deck>("modified"), p)
    );
  }

  whereOwnerId(p: Predicate<Data["ownerId"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"ownerId", Data, Deck>("ownerId"), p)
    );
  }

  whereSelectedSlideId(p: Predicate<Data["selectedSlideId"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(
        new ModelFieldGetter<"selectedSlideId", Data, Deck>("selectedSlideId"),
        p
      )
    );
  }
  queryOwner(): UserQuery {
    return new UserQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(
        this.ctx,
        this,
        DeckSpec.outboundEdges.owner
      ),
      modelLoad(this.ctx, UserSpec.createFrom)
    );
  }
  querySlides(): SlideQuery {
    return new SlideQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(
        this.ctx,
        this,
        DeckSpec.outboundEdges.slides
      ),
      modelLoad(this.ctx, SlideSpec.createFrom)
    );
  }
  querySelectedSlide(): SlideQuery {
    return new SlideQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(
        this.ctx,
        this,
        DeckSpec.outboundEdges.selectedSlide
      ),
      modelLoad(this.ctx, SlideSpec.createFrom)
    );
  }
  queryEditors(): UserQuery {
    return new UserQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(
        this.ctx,
        this,
        DeckSpec.outboundEdges.editors
      ),
      modelLoad(this.ctx, UserSpec.createFrom)
    );
  }

  take(n: number) {
    return new DeckQuery(this.ctx, this, take(n));
  }

  orderById(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"id", Data, Deck>("id"), direction)
    );
  }

  orderByName(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"name", Data, Deck>("name"), direction)
    );
  }

  orderByCreated(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"created", Data, Deck>("created"), direction)
    );
  }

  orderByModified(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"modified", Data, Deck>("modified"),
        direction
      )
    );
  }

  orderByOwnerId(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"ownerId", Data, Deck>("ownerId"), direction)
    );
  }

  orderBySelectedSlideId(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"selectedSlideId", Data, Deck>("selectedSlideId"),
        direction
      )
    );
  }
}
