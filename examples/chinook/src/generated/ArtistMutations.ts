// SIGNED-SOURCE: <a929191e992fc049ca8f0e8e765e5a1b>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import * as impls from "./ArtistMutationsImpl.js";
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import Artist from "./Artist.js";
import { default as spec } from "./ArtistSpec.js";
import { Data } from "./Artist.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";

export type CreateArgs = { name: string | null };

export type RenameArgs = { name: string | null };
class Mutations extends MutationsBase<Artist, Data> {
  constructor(ctx: Context, mutator: ICreateOrUpdateBuilder<Artist, Data>) {
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

export default class ArtistMutations {
  static create(ctx: Context, args: CreateArgs): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(spec)).create(args);
  }
  static rename(model: Artist, args: RenameArgs): Mutations {
    return new Mutations(
      model.ctx,
      new UpdateMutationBuilder(spec, model)
    ).rename(args);
  }
}
