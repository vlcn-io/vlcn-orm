// SIGNED-SOURCE: <c531dec8b47fa3125e16e119084f6783>
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import Todo from "./Todo.js";
import { default as spec } from "./TodoSpec.js";
import { Data } from "./Todo.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";

// BEGIN-MANUAL-SECTION: [module-level]
import { SID_of, sid } from "@aphro/runtime-ts";
import TodoList from "./TodoList.js";
// END-MANUAL-SECTION

class Mutations extends MutationsBase<Todo, Data> {
  constructor(ctx: Context, mutator: ICreateOrUpdateBuilder<Todo, Data>) {
    super(ctx, mutator);
  }

  create({ text, listId }: { text: string; listId: SID_of<TodoList> }): this {
    // BEGIN-MANUAL-SECTION: [create]
    this.mutator.set({
      id: sid('fixme'),
      text,
      listId,
      created: Date.now(),
      modified: Date.now(),
    });
    // END-MANUAL-SECTION
    return this;
  }

  toggleComplete({ completed }: { completed: number | null }): this {
    // BEGIN-MANUAL-SECTION: [toggleComplete]
    this.mutator.set({
      completed: completed == null ? Date.now() : null,
    });
    // END-MANUAL-SECTION
    return this;
  }

  changeText({ text }: { text: string }): this {
    // BEGIN-MANUAL-SECTION: [changeText]
    this.mutator.set({
      text,
    });
    // END-MANUAL-SECTION
    return this;
  }

  delete({}: {}): this {
    // BEGIN-MANUAL-SECTION: [delete]
    // END-MANUAL-SECTION
    return this;
  }
}

export default class TodoMutations {
  static create(
    ctx: Context,
    args: { text: string; listId: SID_of<TodoList> }
  ): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(spec)).create(args);
  }
  static toggleComplete(
    model: Todo,
    args: { completed: number | null }
  ): Mutations {
    return new Mutations(
      model.ctx,
      new UpdateMutationBuilder(spec, model)
    ).toggleComplete(args);
  }

  static changeText(model: Todo, args: { text: string }): Mutations {
    return new Mutations(
      model.ctx,
      new UpdateMutationBuilder(spec, model)
    ).changeText(args);
  }
  static delete(model: Todo, args: {}): Mutations {
    return new Mutations(
      model.ctx,
      new DeleteMutationBuilder(spec, model)
    ).delete(args);
  }
}
