// SIGNED-SOURCE: <670b1521b28b7094c6115f9898a01230>
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import TodoList from "./TodoList.js";
import { default as spec } from "./TodoListSpec.js";
import { Data } from "./TodoList.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";

// BEGIN-MANUAL-SECTION: [module-level]
// Manual section for any new imports / export / top level things
// END-MANUAL-SECTION

class Mutations extends MutationsBase<TodoList, Data> {
  constructor(ctx: Context, mutator: ICreateOrUpdateBuilder<TodoList, Data>) {
    super(ctx, mutator);
  }

  create({}: {}): this {
    // BEGIN-MANUAL-SECTION: [create]
    throw new Error("Mutation create is not implemented!");
    // END-MANUAL-SECTION
    return this;
  }

  filter({ filter }: { filter: "all" | "active" | "completed" }): this {
    // BEGIN-MANUAL-SECTION: [filter]
    throw new Error("Mutation filter is not implemented!");
    // END-MANUAL-SECTION
    return this;
  }

  edit({ editing }: { editing: SID_of<Todo> }): this {
    // BEGIN-MANUAL-SECTION: [edit]
    throw new Error("Mutation edit is not implemented!");
    // END-MANUAL-SECTION
    return this;
  }
}

export default class TodoListMutations {
  static create(ctx: Context, args: {}): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(spec)).create(args);
  }
  static filter(
    model: TodoList,
    args: { filter: "all" | "active" | "completed" }
  ): Mutations {
    return new Mutations(
      model.ctx,
      new UpdateMutationBuilder(spec, model)
    ).filter(args);
  }

  static edit(model: TodoList, args: { editing: SID_of<Todo> }): Mutations {
    return new Mutations(
      model.ctx,
      new UpdateMutationBuilder(spec, model)
    ).edit(args);
  }
}
