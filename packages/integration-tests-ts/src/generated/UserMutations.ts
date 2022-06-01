// SIGNED-SOURCE: <a15c9aed6e089d6338569ba06febf9ae>
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
import {sid} from '@aphro/runtime-ts';
// END-MANUAL-SECTION

class Mutations extends MutationsBase<User, Data> {
  constructor(ctx: Context, mutator: ICreateOrUpdateBuilder<User, Data>) {
    super(ctx, mutator);
  }

  create({ name }: { name: string }): this {
    // BEGIN-MANUAL-SECTION: [create]
    this.mutator.set({
      id: sid('test'),
      name,
      created: Date.now(),
      modified: Date.now(),
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

export default class UserMutations {
  static create(ctx: Context, args: { name: string }): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(spec)).create(args);
  }

  static delete(model: User, args: {}): Mutations {
    return new Mutations(
      model.ctx,
      new DeleteMutationBuilder(spec, model)
    ).delete(args);
  }
}
