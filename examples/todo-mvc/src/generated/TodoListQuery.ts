// SIGNED-SOURCE: <cc81312f251e3ebf92182367be74fb33>
import { Context } from "@aphro/runtime-ts";
import { DerivedQuery } from "@aphro/runtime-ts";
import { QueryFactory } from "@aphro/runtime-ts";
import { modelLoad } from "@aphro/runtime-ts";
import { filter } from "@aphro/runtime-ts";
import { Predicate } from "@aphro/runtime-ts";
import { P } from "@aphro/runtime-ts";
import { ModelFieldGetter } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import TodoList from "./TodoList.js";
import { Data } from "./TodoList.js";
import { default as spec } from "./TodoListSpec.js";
import AppState from "./AppState.js";
import Todo from "./Todo.js";
import { default as TodoSpec } from "./TodoSpec.js";
import TodoQuery from "./TodoQuery";

export default class TodoListQuery extends DerivedQuery<TodoList> {
  static create(ctx: Context) {
    return new TodoListQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, spec),
      modelLoad(ctx, spec.createFrom)
    );
  }

  static fromId(ctx: Context, id: SID_of<TodoList>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return new TodoListQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"id", Data, TodoList>("id"), p)
    );
  }

  whereFilter(p: Predicate<Data["filter"]>) {
    return new TodoListQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"filter", Data, TodoList>("filter"), p)
    );
  }

  whereEditing(p: Predicate<Data["editing"]>) {
    return new TodoListQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"editing", Data, TodoList>("editing"), p)
    );
  }
  queryTodos(): TodoQuery {
    return new TodoQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(this.ctx, this, spec.outboundEdges.todos),
      modelLoad(this.ctx, TodoSpec.createFrom)
    );
  }
}
