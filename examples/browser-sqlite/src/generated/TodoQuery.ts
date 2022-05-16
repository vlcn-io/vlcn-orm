// SIGNED-SOURCE: <d996ee37406ab41e9172d48dd6f5cc80>
import { Context } from "@aphro/context-runtime-ts";
import { DerivedQuery } from "@aphro/query-runtime-ts";
import { QueryFactory } from "@aphro/query-runtime-ts";
import { modelLoad } from "@aphro/query-runtime-ts";
import { filter } from "@aphro/query-runtime-ts";
import { Predicate } from "@aphro/query-runtime-ts";
import { P } from "@aphro/query-runtime-ts";
import { ModelFieldGetter } from "@aphro/query-runtime-ts";
import { SID_of } from "@strut/sid";
import Todo from "./Todo.js";
import { Data } from "./Todo.js";
import { default as spec } from "./TodoSpec.js";
import User from "./User.js";

export default class TodoQuery extends DerivedQuery<Todo> {
  static create(ctx: Context) {
    return new TodoQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, spec),
      modelLoad(ctx, spec.createFrom)
    );
  }

  static fromId(ctx: Context, id: SID_of<Todo>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return new TodoQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"id", Data, Todo>("id"), p)
    );
  }

  whereText(p: Predicate<Data["text"]>) {
    return new TodoQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"text", Data, Todo>("text"), p)
    );
  }

  whereCreated(p: Predicate<Data["created"]>) {
    return new TodoQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"created", Data, Todo>("created"), p)
    );
  }

  whereModified(p: Predicate<Data["modified"]>) {
    return new TodoQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"modified", Data, Todo>("modified"), p)
    );
  }

  whereOwnerId(p: Predicate<Data["ownerId"]>) {
    return new TodoQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"ownerId", Data, Todo>("ownerId"), p)
    );
  }
}
