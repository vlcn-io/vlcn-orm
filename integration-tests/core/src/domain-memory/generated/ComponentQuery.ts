// SIGNED-SOURCE: <393507ef125b51262aabfb042cb16758>
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
import Component from "../Component.js";
import { Data } from "./ComponentBase.js";
import ComponentSpec from "./ComponentSpec.js";
import Slide from "../Slide.js";

export default class ComponentQuery extends DerivedQuery<Component> {
  static create(ctx: Context) {
    return new ComponentQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, ComponentSpec),
      modelLoad(ctx, ComponentSpec.createFrom)
    );
  }

  static empty(ctx: Context) {
    return new ComponentQuery(ctx, new EmptyQuery(ctx));
  }

  protected derive(expression: Expression): ComponentQuery {
    return new ComponentQuery(this.ctx, this, expression);
  }

  static fromId(ctx: Context, id: SID_of<Component>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"id", Data, Component>("id"), p)
    );
  }

  whereSubtype(p: Predicate<Data["subtype"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"subtype", Data, Component>("subtype"), p)
    );
  }

  whereSlideId(p: Predicate<Data["slideId"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"slideId", Data, Component>("slideId"), p)
    );
  }

  whereContent(p: Predicate<Data["content"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"content", Data, Component>("content"), p)
    );
  }

  take(n: number) {
    return new ComponentQuery(this.ctx, this, take(n));
  }

  orderById(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"id", Data, Component>("id"), direction)
    );
  }

  orderBySubtype(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"subtype", Data, Component>("subtype"),
        direction
      )
    );
  }

  orderBySlideId(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"slideId", Data, Component>("slideId"),
        direction
      )
    );
  }

  orderByContent(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"content", Data, Component>("content"),
        direction
      )
    );
  }
}
