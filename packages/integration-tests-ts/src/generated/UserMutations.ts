// SIGNED-SOURCE: <d736cb3750e38343a2613b2ae56bf31a>
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

  static creation(ctx: Context) {
    return new UserMutations(ctx, new CreateMutationBuilder(spec));
  }

  static deletion(model: User) {
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
