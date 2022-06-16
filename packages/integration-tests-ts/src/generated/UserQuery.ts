// SIGNED-SOURCE: <2886e8434b726fafe85c7af365b69c11>
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
import { SID_of } from "@aphro/runtime-ts";
import User from "./User.js";
import { Data } from "./User.js";
import { default as spec } from "./UserSpec.js";
import { default as DeckSpec } from "./DeckSpec.js";
import DeckQuery from "./DeckQuery.js";

export default class UserQuery extends DerivedQuery<User> {
  static create(ctx: Context) {
    return new UserQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, spec),
      modelLoad(ctx, spec.createFrom)
    );
  }

  static fromId(ctx: Context, id: SID_of<User>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return new UserQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"id", Data, User>("id"), p)
    );
  }

  whereName(p: Predicate<Data["name"]>) {
    return new UserQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"name", Data, User>("name"), p)
    );
  }

  whereCreated(p: Predicate<Data["created"]>) {
    return new UserQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"created", Data, User>("created"), p)
    );
  }

  whereModified(p: Predicate<Data["modified"]>) {
    return new UserQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"modified", Data, User>("modified"), p)
    );
  }
  queryDecks(): DeckQuery {
    return new DeckQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(this.ctx, this, spec.outboundEdges.decks),
      modelLoad(this.ctx, DeckSpec.createFrom)
    );
  }

  take(n: number) {
    return new UserQuery(this.ctx, this, take(n));
  }

  orderById(direction: "asc" | "desc" = "asc") {
    return new UserQuery(
      this.ctx,
      this,
      orderBy(new ModelFieldGetter<"id", Data, User>("id"), direction)
    );
  }

  orderByName(direction: "asc" | "desc" = "asc") {
    return new UserQuery(
      this.ctx,
      this,
      orderBy(new ModelFieldGetter<"name", Data, User>("name"), direction)
    );
  }

  orderByCreated(direction: "asc" | "desc" = "asc") {
    return new UserQuery(
      this.ctx,
      this,
      orderBy(new ModelFieldGetter<"created", Data, User>("created"), direction)
    );
  }

  orderByModified(direction: "asc" | "desc" = "asc") {
    return new UserQuery(
      this.ctx,
      this,
      orderBy(
        new ModelFieldGetter<"modified", Data, User>("modified"),
        direction
      )
    );
  }
}
