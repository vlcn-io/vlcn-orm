// SIGNED-SOURCE: <9d0961e16b687321e8111ffbab374128>
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
import TodoList from "../TodoList.js";
import { Data } from "./TodoListBase.js";
import TodoListSpec from "./TodoListSpec.js";
import Todo from "../Todo.js";
import TodoSpec from "./TodoSpec.js";
import TodoQuery from "./TodoQuery.js";

export default class TodoListQuery extends DerivedQuery<TodoList> {
  static create(ctx: Context) {
    return new TodoListQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, TodoListSpec),
      modelLoad(ctx, TodoListSpec.createFrom)
    );
  }

  static empty(ctx: Context) {
    return new TodoListQuery(ctx, new EmptyQuery(ctx));
  }

  protected derive(expression: Expression): TodoListQuery {
    return new TodoListQuery(this.ctx, this, expression);
  }

  static fromId(ctx: Context, id: SID_of<TodoList>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"id", Data, TodoList>("id"), p)
    );
  }

  whereFilter(p: Predicate<Data["filter"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"filter", Data, TodoList>("filter"), p)
    );
  }

  whereEditing(p: Predicate<Data["editing"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"editing", Data, TodoList>("editing"), p)
    );
  }
  queryTodos(): TodoQuery {
    return new TodoQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(
        this.ctx,
        this,
        TodoListSpec.outboundEdges.todos
      ),
      modelLoad(this.ctx, TodoSpec.createFrom)
    );
  }

  take(n: number) {
    return new TodoListQuery(this.ctx, this, take(n));
  }

  orderById(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"id", Data, TodoList>("id"), direction)
    );
  }

  orderByFilter(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"filter", Data, TodoList>("filter"),
        direction
      )
    );
  }

  orderByEditing(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"editing", Data, TodoList>("editing"),
        direction
      )
    );
  }
}
