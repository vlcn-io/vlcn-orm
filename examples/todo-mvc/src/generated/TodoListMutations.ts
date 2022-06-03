// SIGNED-SOURCE: <8bacdfbb370615e9b3f7ec3b90fed87e>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
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
import { SID_of, sid } from "@aphro/runtime-ts";
import Todo from "./Todo.js";
// END-MANUAL-SECTION

class Mutations extends MutationsBase<TodoList, Data> {
  constructor(ctx: Context, mutator: ICreateOrUpdateBuilder<TodoList, Data>) {
    super(ctx, mutator);
  }

  create({}: {}): this {
    // BEGIN-MANUAL-SECTION: [create]
    this.mutator.set({
      id: sid('fixme'),
      filter: 'all',
      editing: null,
    });
    // END-MANUAL-SECTION
    return this;
  }

  filter({ filter }: { filter: "all" | "active" | "completed" }): this {
    // BEGIN-MANUAL-SECTION: [filter]
    this.mutator.set({
      filter,
    });
    // END-MANUAL-SECTION
    return this;
  }

  edit({ editing }: { editing: SID_of<Todo> | null }): this {
    // BEGIN-MANUAL-SECTION: [edit]
    this.mutator.set({editing});
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

  static edit(
    model: TodoList,
    args: { editing: SID_of<Todo> | null }
  ): Mutations {
    return new Mutations(
      model.ctx,
      new UpdateMutationBuilder(spec, model)
    ).edit(args);
  }
}
