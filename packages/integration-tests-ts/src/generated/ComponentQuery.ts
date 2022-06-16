// SIGNED-SOURCE: <bfb20b5e0854a223df835a016bbec16d>
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
import Component from "./Component.js";
import { Data } from "./Component.js";
import { default as spec } from "./ComponentSpec.js";
import Slide from "./Slide.js";

export default class ComponentQuery extends DerivedQuery<Component> {
  static create(ctx: Context) {
    return new ComponentQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, spec),
      modelLoad(ctx, spec.createFrom)
    );
  }

  static fromId(ctx: Context, id: SID_of<Component>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return new ComponentQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"id", Data, Component>("id"), p)
    );
  }

  whereSubtype(p: Predicate<Data["subtype"]>) {
    return new ComponentQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"subtype", Data, Component>("subtype"), p)
    );
  }

  whereSlideId(p: Predicate<Data["slideId"]>) {
    return new ComponentQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"slideId", Data, Component>("slideId"), p)
    );
  }

  whereContent(p: Predicate<Data["content"]>) {
    return new ComponentQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"content", Data, Component>("content"), p)
    );
  }

  take(n: number) {
    return new ComponentQuery(this.ctx, this, take(n));
  }

  orderById(direction: "asc" | "desc" = "asc") {
    return new ComponentQuery(
      this.ctx,
      this,
      orderBy(new ModelFieldGetter<"id", Data, Component>("id"), direction)
    );
  }

  orderBySubtype(direction: "asc" | "desc" = "asc") {
    return new ComponentQuery(
      this.ctx,
      this,
      orderBy(
        new ModelFieldGetter<"subtype", Data, Component>("subtype"),
        direction
      )
    );
  }

  orderBySlideId(direction: "asc" | "desc" = "asc") {
    return new ComponentQuery(
      this.ctx,
      this,
      orderBy(
        new ModelFieldGetter<"slideId", Data, Component>("slideId"),
        direction
      )
    );
  }

  orderByContent(direction: "asc" | "desc" = "asc") {
    return new ComponentQuery(
      this.ctx,
      this,
      orderBy(
        new ModelFieldGetter<"content", Data, Component>("content"),
        direction
      )
    );
  }
}
