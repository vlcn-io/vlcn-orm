// SIGNED-SOURCE: <27c6d23f2914402119c9675918e3d4f1>
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
// Manual section for any new imports / export / top level things
// END-MANUAL-SECTION

class Mutations extends MutationsBase<Todo, Data> {
  constructor(ctx: Context, mutator: ICreateOrUpdateBuilder<Todo, Data>) {
    super(ctx, mutator);
  }

  create({ text }: { text: string }): this {
    // BEGIN-MANUAL-SECTION: [create]
    throw new Error("Mutation create is not implemented!");
    // END-MANUAL-SECTION
    return this;
  }

  toggleComplete({}: {}): this {
    // BEGIN-MANUAL-SECTION: [toggleComplete]
    throw new Error("Mutation toggleComplete is not implemented!");
    // END-MANUAL-SECTION
    return this;
  }

  changeText({ text }: { text: string }): this {
    // BEGIN-MANUAL-SECTION: [changeText]
    throw new Error("Mutation changeText is not implemented!");
    // END-MANUAL-SECTION
    return this;
  }
}

export default class TodoMutations {
  static create(ctx: Context, args: { text: string }): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(spec)).create(args);
  }
  static toggleComplete(model: Todo, args: {}): Mutations {
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
}
