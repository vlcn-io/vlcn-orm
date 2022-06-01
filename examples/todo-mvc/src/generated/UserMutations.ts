// SIGNED-SOURCE: <b50e10c6d5167d475244042073238c92>
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import User from "./User.js";
import { default as spec } from "./UserSpec.js";
import { Data } from "./User.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";

// BEGIN-MANUAL-SECTION: [module-level]
// Manual section for any new imports / export / top level things
// END-MANUAL-SECTION

class Mutations extends MutationsBase<User, Data> {
  constructor(ctx: Context, mutator: ICreateOrUpdateBuilder<User, Data>) {
    super(ctx, mutator);
  }

  create({ name }: { name: string }): this {
    // BEGIN-MANUAL-SECTION: [create]
    throw new Error("Mutation create is not implemented!");
    // END-MANUAL-SECTION
    return this;
  }
}

export default class UserMutations {
  static create(ctx: Context, args: { name: string }): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(spec)).create(args);
  }
}
