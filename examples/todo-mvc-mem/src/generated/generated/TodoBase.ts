// SIGNED-SOURCE: <398163652ef888c1b6508aa9593b4a43>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import Todo from "../Todo.js";
import { default as s } from "./TodoSpec.js";
import { P } from "@aphro/runtime-ts";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { modelGenMemo } from "@aphro/runtime-ts";
import { OptimisticPromise } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import TodoQuery from "./TodoQuery.js";
import { Context } from "@aphro/runtime-ts";
import TodoList from "../TodoList.js";

export type Data = {
  id: SID_of<Todo>;
  listId: SID_of<TodoList>;
  text: string;
  completed: boolean;
};

// @Sealed(Todo)
export default abstract class TodoBase extends Node<Data> {
  readonly spec = s as unknown as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as unknown as SID_of<this>;
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

  static genx = modelGenMemo(
    "todomvc",
    "todo",
    (ctx: Context, id: SID_of<Todo>): OptimisticPromise<Todo> =>
      new OptimisticPromise((resolve, reject) =>
        this.queryAll(ctx)
          .whereId(P.equals(id))
          .genxOnlyValue()
          .then(resolve, reject)
      )
  );

  static gen = modelGenMemo(
    "todomvc",
    "todo",
    (ctx: Context, id: SID_of<Todo>): OptimisticPromise<Todo | null> =>
      new OptimisticPromise((resolve, reject) =>
        this.queryAll(ctx)
          .whereId(P.equals(id))
          .genOnlyValue()
          .then(resolve, reject)
      )
  );

  update(data: Partial<Data>) {
    return new UpdateMutationBuilder(this.ctx, this.spec, this)
      .set(data)
      .toChangeset();
  }

  static create(ctx: Context, data: Partial<Data>) {
    return new CreateMutationBuilder(ctx, s).set(data).toChangeset();
  }

  delete() {
    return new DeleteMutationBuilder(this.ctx, this.spec, this).toChangeset();
  }
}
