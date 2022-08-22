// SIGNED-SOURCE: <41110f78131683a6240cc48af24780b6>
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
import Foo from "../Foo.js";
import { Data } from "./FooBase.js";
import FooSpec from "./FooSpec.js";

export default class FooQuery extends DerivedQuery<Foo> {
  static create(ctx: Context) {
    return new FooQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, FooSpec),
      modelLoad(ctx, FooSpec.createFrom)
    );
  }

  static empty(ctx: Context) {
    return new FooQuery(ctx, new EmptyQuery(ctx));
  }

  protected derive(expression: Expression): FooQuery {
    return new FooQuery(this.ctx, this, expression);
  }

  static fromId(ctx: Context, id: SID_of<Foo>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"id", Data, Foo>("id"), p)
    );
  }

  whereName(p: Predicate<Data["name"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"name", Data, Foo>("name"), p)
    );
  }

  take(n: number) {
    return new FooQuery(this.ctx, this, take(n));
  }

  orderById(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"id", Data, Foo>("id"), direction)
    );
  }

  orderByName(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"name", Data, Foo>("name"), direction)
    );
  }
}
