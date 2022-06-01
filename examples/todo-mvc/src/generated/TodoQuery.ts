// SIGNED-SOURCE: <970498f7f331f3b443b6489052a6010b>
import { Context } from "@aphro/runtime-ts";
import { DerivedQuery } from "@aphro/runtime-ts";
import { QueryFactory } from "@aphro/runtime-ts";
import { modelLoad } from "@aphro/runtime-ts";
import { filter } from "@aphro/runtime-ts";
import { Predicate } from "@aphro/runtime-ts";
import { P } from "@aphro/runtime-ts";
import { ModelFieldGetter } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import Todo from "./Todo.js";
import { Data } from "./Todo.js";
import { default as spec } from "./TodoSpec.js";

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

  whereCompleted(p: Predicate<Data["completed"]>) {
    return new TodoQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"completed", Data, Todo>("completed"), p)
    );
  }
}
