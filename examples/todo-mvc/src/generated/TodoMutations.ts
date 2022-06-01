// SIGNED-SOURCE: <45c9a8d7aca11c61f2cb9ead31c3c585>
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
}

export default class TodoMutations {
  static create(ctx: Context, args: { text: string }): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(spec)).create(args);
  }
}
