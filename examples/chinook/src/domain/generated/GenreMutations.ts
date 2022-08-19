// SIGNED-SOURCE: <6e0dfbf4ea2be93c6e076f35814d269f>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import * as impls from "../GenreMutationsImpl.js";
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import Genre from "../Genre.js";
import { default as spec } from "./GenreSpec.js";
import { Data } from "./GenreBase.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";

export type CreateArgs = { name: string | null };

export type RenameArgs = { name: string | null };
class Mutations extends MutationsBase<Genre, Data> {
  constructor(
    ctx: Context,
    mutator: ICreateOrUpdateBuilder<Genre, Data>,
    private model?: Genre
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
  constructor(private model: Genre) {}

  rename(args: RenameArgs): Mutations {
    return new Mutations(
      this.model.ctx,
      new UpdateMutationBuilder(this.model.ctx, spec, this.model),
      this.model
    ).rename(args);
  }
}
