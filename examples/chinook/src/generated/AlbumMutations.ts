// SIGNED-SOURCE: <c05ea804d93b4ab308c3a1c277b81602>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import * as impls from "./AlbumMutationsImpl.js";
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import Album from "./Album.js";
import { default as spec } from "./AlbumSpec.js";
import { Data } from "./Album.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";
import Artist from "./Artist.js";
import { Data as ArtistData } from "./Artist.js";

export type CreateArgs = {
  title: string;
  artist: Artist | Changeset<Artist, ArtistData>;
};

export type RetitleArgs = { title: string };
class Mutations extends MutationsBase<Album, Data> {
  constructor(ctx: Context, mutator: ICreateOrUpdateBuilder<Album, Data>) {
    super(ctx, mutator);
  }

  create(args: CreateArgs): this {
    const extraChangesets = impls.createImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }

  retitle(args: RetitleArgs): this {
    const extraChangesets = impls.retitleImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }
}

export default class AlbumMutations {
  static create(ctx: Context, args: CreateArgs): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(spec)).create(args);
  }
  static retitle(model: Album, args: RetitleArgs): Mutations {
    return new Mutations(
      model.ctx,
      new UpdateMutationBuilder(spec, model)
    ).retitle(args);
  }
}
