// SIGNED-SOURCE: <aacdaddb13994916f667fc4fb0918148>
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
import MediaType from "../MediaType.js";
import { Data } from "./MediaTypeBase.js";
import MediaTypeSpec from "./MediaTypeSpec.js";

export default class MediaTypeQuery extends DerivedQuery<MediaType> {
  static create(ctx: Context) {
    return new MediaTypeQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, MediaTypeSpec),
      modelLoad(ctx, MediaTypeSpec.createFrom)
    );
  }

  static empty(ctx: Context) {
    return new MediaTypeQuery(ctx, new EmptyQuery(ctx));
  }

  protected derive(expression: Expression): MediaTypeQuery {
    return new MediaTypeQuery(this.ctx, this, expression);
  }

  static fromId(ctx: Context, id: SID_of<MediaType>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"id", Data, MediaType>("id"), p)
    );
  }

  whereName(p: Predicate<Data["name"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"name", Data, MediaType>("name"), p)
    );
  }

  take(n: number) {
    return new MediaTypeQuery(this.ctx, this, take(n));
  }

  orderById(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"id", Data, MediaType>("id"), direction)
    );
  }

  orderByName(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"name", Data, MediaType>("name"), direction)
    );
  }
}
