// SIGNED-SOURCE: <f532895fda51541fc0087f255c943f6a>
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
import Identity from "../Identity.js";
import { Data } from "./IdentityBase.js";
import IdentitySpec from "./IdentitySpec.js";

export default class IdentityQuery extends DerivedQuery<Identity> {
  static create(ctx: Context) {
    return new IdentityQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, IdentitySpec),
      modelLoad(ctx, IdentitySpec.createFrom)
    );
  }

  static empty(ctx: Context) {
    return new IdentityQuery(ctx, new EmptyQuery(ctx));
  }

  protected derive(expression: Expression): IdentityQuery {
    return new IdentityQuery(this.ctx, this, expression);
  }

  static fromId(ctx: Context, id: SID_of<Identity>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"id", Data, Identity>("id"), p)
    );
  }

  whereIdentifier(p: Predicate<Data["identifier"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(
        new ModelFieldGetter<"identifier", Data, Identity>("identifier"),
        p
      )
    );
  }

  whereToken(p: Predicate<Data["token"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"token", Data, Identity>("token"), p)
    );
  }

  take(n: number) {
    return new IdentityQuery(this.ctx, this, take(n));
  }

  orderById(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"id", Data, Identity>("id"), direction)
    );
  }

  orderByIdentifier(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"identifier", Data, Identity>("identifier"),
        direction
      )
    );
  }

  orderByToken(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"token", Data, Identity>("token"), direction)
    );
  }
}
