// SIGNED-SOURCE: <d3255b1df32d51bb9f9b29de2cd60d92>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { applyMixins } from "@aphro/runtime-ts";
import { default as s } from "./TodoListSpec.js";
import { P } from "@aphro/runtime-ts";
import { ManualMethods, manualMethods } from "./TodoListManualMethods.js";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import TodoListQuery from "./TodoListQuery.js";
import { Context } from "@aphro/runtime-ts";
import TodoQuery from "./TodoQuery.js";
import Todo from "./Todo.js";

export type Data = {
  id: SID_of<TodoList>;
  filter: "all" | "active" | "completed";
  editing: SID_of<Todo> | null;
};

class TodoList extends Node<Data> {
  readonly spec = s as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  get filter(): "all" | "active" | "completed" {
    return this.data.filter;
  }

  get editing(): SID_of<Todo> | null {
    return this.data.editing;
  }

  queryTodos(): TodoQuery {
    return TodoQuery.create(this.ctx).whereListId(P.equals(this.id));
  }

  static queryAll(ctx: Context): TodoListQuery {
    return TodoListQuery.create(ctx);
  }

  static async genx(ctx: Context, id: SID_of<TodoList>): Promise<TodoList> {
    const existing = ctx.cache.get(id, TodoList.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(
    ctx: Context,
    id: SID_of<TodoList>
  ): Promise<TodoList | null> {
    const existing = ctx.cache.get(id, TodoList.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue();
  }
}

interface TodoList extends ManualMethods {}
applyMixins(TodoList, [manualMethods]);
export default TodoList;
