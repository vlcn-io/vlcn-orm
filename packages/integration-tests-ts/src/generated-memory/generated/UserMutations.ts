// SIGNED-SOURCE: <4c42f2252eb7c72747602d5da2a30627>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import * as impls from "../UserMutationsImpl.js";
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import User from "../User.js";
import { default as spec } from "./UserSpec.js";
import { Data } from "./UserBase.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";

export type CreateArgs = { name: string };

export type RenameArgs = { name: string };

export type DeleteArgs = {};
class Mutations extends MutationsBase<User, Data> {
  constructor(
    ctx: Context,
    mutator: ICreateOrUpdateBuilder<User, Data>,
    private model?: User
  ) {
    super(ctx, mutator);
  }

  create(args: CreateArgs): this {
    const extraChangesets = impls.createImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }

  rename(args: RenameArgs): this {
    const extraChangesets = impls.renameImpl(this.model!, this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }

  delete(args: DeleteArgs): this {
    const extraChangesets = impls.deleteImpl(this.model!, this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }
}

const staticMutations = {
  create(ctx: Context, args: CreateArgs): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(ctx, spec)).create(
      args
    );
  },
};

export default staticMutations;

export class InstancedMutations {
  constructor(private model: User) {}

  rename(args: RenameArgs): Mutations {
    return new Mutations(
      this.model.ctx,
      new UpdateMutationBuilder(this.model.ctx, spec, this.model),
      this.model
    ).rename(args);
  }
  delete(args: DeleteArgs): Mutations {
    return new Mutations(
      this.model.ctx,
      new DeleteMutationBuilder(this.model.ctx, spec, this.model),
      this.model
    ).delete(args);
  }
}
