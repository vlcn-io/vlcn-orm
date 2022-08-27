// SIGNED-SOURCE: <23b35c1e92b81ff949b20caf1a10f074>
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
import DeckToEditorsEdge from "../DeckToEditorsEdge.js";
import { Data } from "./DeckToEditorsEdgeBase.js";
import DeckToEditorsEdgeSpec from "./DeckToEditorsEdgeSpec.js";
import Deck from "../Deck.js";
import User from "../User.js";

export default class DeckToEditorsEdgeQuery extends DerivedQuery<DeckToEditorsEdge> {
  static create(ctx: Context) {
    return new DeckToEditorsEdgeQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, DeckToEditorsEdgeSpec),
      modelLoad(ctx, DeckToEditorsEdgeSpec.createFrom)
    );
  }

  static empty(ctx: Context) {
    return new DeckToEditorsEdgeQuery(ctx, new EmptyQuery(ctx));
  }

  protected derive(expression: Expression): DeckToEditorsEdgeQuery {
    return new DeckToEditorsEdgeQuery(this.ctx, this, expression);
  }

  whereId1(p: Predicate<Data["id1"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"id1", Data, DeckToEditorsEdge>("id1"), p)
    );
  }

  whereId2(p: Predicate<Data["id2"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"id2", Data, DeckToEditorsEdge>("id2"), p)
    );
  }

  take(n: number) {
    return new DeckToEditorsEdgeQuery(this.ctx, this, take(n));
  }

  orderById1(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"id1", Data, DeckToEditorsEdge>("id1"),
        direction
      )
    );
  }

  orderById2(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"id2", Data, DeckToEditorsEdge>("id2"),
        direction
      )
    );
  }
}
