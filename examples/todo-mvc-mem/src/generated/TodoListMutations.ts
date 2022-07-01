// SIGNED-SOURCE: <5b59a6ab74f11d8f30179ea751a3c0cb>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import * as impls from "./TodoListMutationsImpl.js";
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import TodoList from "./TodoList.js";
import { default as spec } from "./TodoListSpec.js";
import { Data } from "./TodoList.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";
import Todo from "./Todo.js";

export type CreateArgs = {};

export type FilterArgs = { filter: "all" | "active" | "completed" };

export type EditArgs = { editing: SID_of<Todo> | null };
class Mutations extends MutationsBase<TodoList, Data> {
  constructor(ctx: Context, mutator: ICreateOrUpdateBuilder<TodoList, Data>) {
    super(ctx, mutator);
  }

  create(args: CreateArgs): this {
    const extraChangesets = impls.createImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }

  filter(args: FilterArgs): this {
    const extraChangesets = impls.filterImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }

  edit(args: EditArgs): this {
    const extraChangesets = impls.editImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }
}

export default class TodoListMutations {
  static create(ctx: Context, args: CreateArgs): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(spec)).create(args);
  }
  static filter(model: TodoList, args: FilterArgs): Mutations {
    return new Mutations(
      model.ctx,
      new UpdateMutationBuilder(spec, model)
    ).filter(args);
  }

  static edit(model: TodoList, args: EditArgs): Mutations {
    return new Mutations(
      model.ctx,
      new UpdateMutationBuilder(spec, model)
    ).edit(args);
  }
}
