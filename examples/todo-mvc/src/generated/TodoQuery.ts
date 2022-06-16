// SIGNED-SOURCE: <0cb0a4bd7d4b4c2351eff3e8715cd156>
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
import Todo from "./Todo.js";
import { Data } from "./Todo.js";
import { default as spec } from "./TodoSpec.js";
import TodoList from "./TodoList.js";

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

  whereListId(p: Predicate<Data["listId"]>) {
    return new TodoQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"listId", Data, Todo>("listId"), p)
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

  take(n: number) {
    return new TodoQuery(this.ctx, this, take(n));
  }

  orderById(direction: "asc" | "desc" = "asc") {
    return new TodoQuery(
      this.ctx,
      this,
      orderBy(new ModelFieldGetter<"id", Data, Todo>("id"), direction)
    );
  }

  orderByListId(direction: "asc" | "desc" = "asc") {
    return new TodoQuery(
      this.ctx,
      this,
      orderBy(new ModelFieldGetter<"listId", Data, Todo>("listId"), direction)
    );
  }

  orderByText(direction: "asc" | "desc" = "asc") {
    return new TodoQuery(
      this.ctx,
      this,
      orderBy(new ModelFieldGetter<"text", Data, Todo>("text"), direction)
    );
  }

  orderByCreated(direction: "asc" | "desc" = "asc") {
    return new TodoQuery(
      this.ctx,
      this,
      orderBy(new ModelFieldGetter<"created", Data, Todo>("created"), direction)
    );
  }

  orderByModified(direction: "asc" | "desc" = "asc") {
    return new TodoQuery(
      this.ctx,
      this,
      orderBy(
        new ModelFieldGetter<"modified", Data, Todo>("modified"),
        direction
      )
    );
  }

  orderByCompleted(direction: "asc" | "desc" = "asc") {
    return new TodoQuery(
      this.ctx,
      this,
      orderBy(
        new ModelFieldGetter<"completed", Data, Todo>("completed"),
        direction
      )
    );
  }
}
