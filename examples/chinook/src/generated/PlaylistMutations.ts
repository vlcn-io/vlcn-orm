// SIGNED-SOURCE: <a30e8dcbcda24d30070e618cb0ec60c1>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import * as impls from "./PlaylistMutationsImpl.js";
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import Playlist from "./Playlist.js";
import { default as spec } from "./PlaylistSpec.js";
import { Data } from "./Playlist.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";

export type CreateArgs = { name: string };

export type RenameArgs = { name: string };
class Mutations extends MutationsBase<Playlist, Data> {
  constructor(ctx: Context, mutator: ICreateOrUpdateBuilder<Playlist, Data>) {
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

export default class PlaylistMutations {
  static create(ctx: Context, args: CreateArgs): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(spec)).create(args);
  }
  static rename(model: Playlist, args: RenameArgs): Mutations {
    return new Mutations(
      model.ctx,
      new UpdateMutationBuilder(spec, model)
    ).rename(args);
  }
}
