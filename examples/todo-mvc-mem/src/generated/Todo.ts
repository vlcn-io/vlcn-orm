// SIGNED-SOURCE: <3ddc5d103a2e46b083d8beb0ea3d3929>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { applyMixins } from "@aphro/runtime-ts";
import { default as s } from "./TodoSpec.js";
import { P } from "@aphro/runtime-ts";
import { ManualMethods, manualMethods } from "./TodoManualMethods.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import TodoQuery from "./TodoQuery.js";
import { Context } from "@aphro/runtime-ts";
import TodoList from "./TodoList.js";

export type Data = {
  id: SID_of<Todo>;
  listId: SID_of<TodoList>;
  text: string;
  completed: boolean;
};

class Todo extends Node<Data> {
  readonly spec = s as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  get listId(): SID_of<TodoList> {
    return this.data.listId;
  }

  get text(): string {
    return this.data.text;
  }

  get completed(): boolean {
    return this.data.completed;
  }

  static queryAll(ctx: Context): TodoQuery {
    return TodoQuery.create(ctx);
  }

  static async genx(ctx: Context, id: SID_of<Todo>): Promise<Todo> {
    const existing = ctx.cache.get(id, Todo.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(ctx: Context, id: SID_of<Todo>): Promise<Todo | null> {
    const existing = ctx.cache.get(id, Todo.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue();
  }

  update(data: Partial<Data>) {
    return new UpdateMutationBuilder(this.ctx, this.spec, this)
      .set(data)
      .toChangeset();
  }

  static create(ctx: Context, data: Partial<Data>) {
    return new CreateMutationBuilder(ctx, s).set(data).toChangeset();
  }

  delete() {
    return new DeleteMutationBuilder(this.ctx, s, this).toChangeset();
  }
}

interface Todo extends ManualMethods {}
applyMixins(Todo, [manualMethods]);
export default Todo;
