// SIGNED-SOURCE: <21d257ad71656bf5c663aae7274e371c>
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
import Todo from "../Todo.js";
import { Data } from "./TodoBase.js";
import TodoSpec from "./TodoSpec.js";
import TodoList from "../TodoList.js";

export default class TodoQuery extends DerivedQuery<Todo> {
  static create(ctx: Context) {
    return new TodoQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, TodoSpec),
      modelLoad(ctx, TodoSpec.createFrom)
    );
  }

  static empty(ctx: Context) {
    return new TodoQuery(ctx, new EmptyQuery(ctx));
  }

  protected derive(expression: Expression): TodoQuery {
    return new TodoQuery(this.ctx, this, expression);
  }

  static fromId(ctx: Context, id: SID_of<Todo>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return this.derive(filter(new ModelFieldGetter<"id", Data, Todo>("id"), p));
  }

  whereListId(p: Predicate<Data["listId"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"listId", Data, Todo>("listId"), p)
    );
  }

  whereText(p: Predicate<Data["text"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"text", Data, Todo>("text"), p)
    );
  }

  whereCompleted(p: Predicate<Data["completed"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"completed", Data, Todo>("completed"), p)
    );
  }

  take(n: number) {
    return new TodoQuery(this.ctx, this, take(n));
  }

  orderById(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"id", Data, Todo>("id"), direction)
    );
  }

  orderByListId(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"listId", Data, Todo>("listId"), direction)
    );
  }

  orderByText(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"text", Data, Todo>("text"), direction)
    );
  }

  orderByCompleted(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"completed", Data, Todo>("completed"),
        direction
      )
    );
  }
}
