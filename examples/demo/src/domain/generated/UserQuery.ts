// SIGNED-SOURCE: <6963e704d931441dc118eeee2a245a6d>
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
import User from "../User.js";
import { Data } from "./UserBase.js";
import UserSpec from "./UserSpec.js";

export default class UserQuery extends DerivedQuery<User> {
  static create(ctx: Context) {
    return new UserQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, UserSpec),
      modelLoad(ctx, UserSpec.createFrom)
    );
  }

  static empty(ctx: Context) {
    return new UserQuery(ctx, new EmptyQuery(ctx));
  }

  protected derive(expression: Expression): UserQuery {
    return new UserQuery(this.ctx, this, expression);
  }

  static fromId(ctx: Context, id: SID_of<User>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"id", Data, User>("id"), p)
    );
  }

  whereEmail(p: Predicate<Data["email"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"email", Data, User>("email"), p)
    );
  }

  take(n: number) {
    return new UserQuery(this.ctx, this, take(n));
  }

  orderById(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"id", Data, User>("id"), direction)
    );
  }

  orderByEmail(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"email", Data, User>("email"), direction)
    );
  }
}
