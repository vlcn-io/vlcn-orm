// SIGNED-SOURCE: <f516bbf163594ea60f33e79aa65bbec4>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import Genre from "../Genre.js";
import { default as s } from "./GenreSpec.js";
import { P } from "@aphro/runtime-ts";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { makeSavable } from "@aphro/runtime-ts";
import { modelGenMemo } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import GenreQuery from "./GenreQuery.js";
import { Context } from "@aphro/runtime-ts";
import TrackQuery from "./TrackQuery.js";
import Track from "../Track.js";
import GenreMutations from "./GenreMutations.js";
import { InstancedMutations } from "./GenreMutations.js";

declare type Muts = typeof GenreMutations;
declare type IMuts = InstancedMutations;

export type Data = {
  id: SID_of<Genre>;
  name: string | null;
};

// @Sealed(Genre)
export default abstract class GenreBase extends Node<Data> {
  readonly spec = s as unknown as NodeSpecWithCreate<this, Data>;

  static get mutations(): Muts {
    return GenreMutations;
  }

  get mutations(): IMuts {
    return new InstancedMutations(this as any);
  }

  get id(): SID_of<this> {
    return this.data.id as unknown as SID_of<this>;
  }

  get name(): string | null {
    return this.data.name;
  }

  queryTracks(): TrackQuery {
    return TrackQuery.create(this.ctx).whereGenreId(P.equals(this.id as any));
  }

  static queryAll(ctx: Context): GenreQuery {
    return GenreQuery.create(ctx);
  }

  static genx = modelGenMemo(
    "chinook",
    "genre",
    (ctx: Context, id: SID_of<Genre>): Promise<Genre> =>
      this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue()
  );

  static gen = modelGenMemo<Genre | null>(
    "chinook",
    "genre",
    // @ts-ignore #43
    (ctx: Context, id: SID_of<Genre>): Promise<Genre | null> =>
      this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue()
  );

  delete() {
    return makeSavable(
      this.ctx,
      new DeleteMutationBuilder(this.ctx, this.spec, this).toChangesets()[0]
    );
  }
}
