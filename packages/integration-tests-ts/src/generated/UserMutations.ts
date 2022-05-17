// SIGNED-SOURCE: <7c0113515d60d15235b704978ab41806>
import { ICreateOrUpdateBuilder } from "@aphro/mutator-runtime-ts";
import { Context } from "@aphro/context-runtime-ts";
import { MutationsBase } from "@aphro/mutator-runtime-ts";
import User from "./User.js";
import { default as spec } from "./UserSpec.js";
import { Data } from "./User.js";
import { UpdateMutationBuilder } from "@aphro/mutator-runtime-ts";
import { CreateMutationBuilder } from "@aphro/mutator-runtime-ts";
import { DeleteMutationBuilder } from "@aphro/mutator-runtime-ts";

export default class UserMutations extends MutationsBase<User, Data> {
  private constructor(
    ctx: Context,
    mutator: ICreateOrUpdateBuilder<User, Data>
  ) {
    super(ctx, mutator);
  }

  static update(model: User) {
    return new UserMutations(model.ctx, new UpdateMutationBuilder(spec, model));
  }

  static create(ctx: Context) {
    return new UserMutations(ctx, new CreateMutationBuilder(spec));
  }

  static delete(model: User) {
    return new UserMutations(model.ctx, new DeleteMutationBuilder(spec, model));
  }

  create({ name }: { name: string }): this {
    // BEGIN-MANUAL-SECTION
    // END-MANUAL-SECTION
    return this;
  }

  delete({}: {}): this {
    // BEGIN-MANUAL-SECTION
    // END-MANUAL-SECTION
    return this;
  }
}
