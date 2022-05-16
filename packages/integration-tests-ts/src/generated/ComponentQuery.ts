// SIGNED-SOURCE: <8de1f2ae168431000c46f866e90d4bb5>
import { Context } from "@aphro/context-runtime-ts";
import { DerivedQuery } from "@aphro/query-runtime-ts";
import { QueryFactory } from "@aphro/query-runtime-ts";
import { modelLoad } from "@aphro/query-runtime-ts";
import { filter } from "@aphro/query-runtime-ts";
import { Predicate } from "@aphro/query-runtime-ts";
import { P } from "@aphro/query-runtime-ts";
import { ModelFieldGetter } from "@aphro/query-runtime-ts";
import { SID_of } from "@strut/sid";
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
}
