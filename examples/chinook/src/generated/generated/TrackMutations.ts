// SIGNED-SOURCE: <0d47f67a86fe951b9cdc497cfe6e6cee>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import * as impls from "../TrackMutationsImpl.js";
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import Track from "../Track.js";
import { default as spec } from "./TrackSpec.js";
import { Data } from "./TrackBase.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";
import Album from "../Album.js";
import { Data as AlbumData } from "./AlbumBase.js";
import MediaType from "../MediaType.js";
import { Data as MediaTypeData } from "./MediaTypeBase.js";
import Genre from "../Genre.js";
import { Data as GenreData } from "./GenreBase.js";

export type CreateArgs = {
  name: string;
  album: Album | Changeset<Album, AlbumData>;
  mediaType: MediaType | Changeset<MediaType, MediaTypeData> | null;
  genre: Genre | Changeset<Genre, GenreData> | null;
  composer: string | null;
  milliseconds: number;
  bytes: number | null;
  unitPrice: number;
};
class Mutations extends MutationsBase<Track, Data> {
  constructor(ctx: Context, mutator: ICreateOrUpdateBuilder<Track, Data>) {
    super(ctx, mutator);
  }

  create(args: CreateArgs): this {
    const extraChangesets = impls.createImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }
}

export default class TrackMutations {
  static create(ctx: Context, args: CreateArgs): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(ctx, spec)).create(
      args
    );
  }
}
