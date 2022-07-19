// SIGNED-SOURCE: <447f7c46620b2d574aac0e96aeae8a7d>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import * as impls from "../MediaTypeMutationsImpl.js";
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import MediaType from "../MediaType.js";
import { default as spec } from "./MediaTypeSpec.js";
import { Data } from "./MediaTypeBase.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";

export type CreateArgs = { name: string };

export type RenameArgs = { name: string };
class Mutations extends MutationsBase<MediaType, Data> {
  constructor(ctx: Context, mutator: ICreateOrUpdateBuilder<MediaType, Data>) {
    super(ctx, mutator);
  }

  create(args: CreateArgs): this {
    const extraChangesets = impls.createImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }

  rename(args: RenameArgs): this {
    const extraChangesets = impls.renameImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }
}

export default class MediaTypeMutations {
  static create(ctx: Context, args: CreateArgs): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(ctx, spec)).create(
      args
    );
  }
  static rename(model: MediaType, args: RenameArgs): Mutations {
    return new Mutations(
      model.ctx,
      new UpdateMutationBuilder(model.ctx, spec, model)
    ).rename(args);
  }
}
