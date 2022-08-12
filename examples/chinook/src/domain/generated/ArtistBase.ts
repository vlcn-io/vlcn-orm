// SIGNED-SOURCE: <c20c2461478a673d75ca6b942bd0deb9>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import Artist from "../Artist.js";
import { default as s } from "./ArtistSpec.js";
import { P } from "@aphro/runtime-ts";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { makeSavable } from "@aphro/runtime-ts";
import { modelGenMemo } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import ArtistQuery from "./ArtistQuery.js";
import { Context } from "@aphro/runtime-ts";
import albumQuery from "./albumQuery.js";
import album from "../album.js";
import ArtistMutations from "./ArtistMutations.js";

declare type Muts = typeof ArtistMutations;

export type Data = {
  id: SID_of<Artist>;
  name: string | null;
};

// @Sealed(Artist)
export default abstract class ArtistBase extends Node<Data> {
  readonly spec = s as unknown as NodeSpecWithCreate<this, Data>;

  static get mutations(): Muts {
    return ArtistMutations;
  }

  get id(): SID_of<this> {
    return this.data.id as unknown as SID_of<this>;
  }

  get name(): string | null {
    return this.data.name;
  }

  queryAlbums(): albumQuery {
    return albumQuery.create(this.ctx).whereArtistId(P.equals(this.id as any));
  }

  static queryAll(ctx: Context): ArtistQuery {
    return ArtistQuery.create(ctx);
  }

  static genx = modelGenMemo(
    "chinook",
    "artist",
    (ctx: Context, id: SID_of<Artist>): Promise<Artist> =>
      this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue()
  );

  static gen = modelGenMemo<Artist | null>(
    "chinook",
    "artist",
    // @ts-ignore #43
    (ctx: Context, id: SID_of<Artist>): Promise<Artist | null> =>
      this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue()
  );

  delete() {
    return makeSavable(
      this.ctx,
      new DeleteMutationBuilder(this.ctx, this.spec, this).toChangesets()[0]
    );
  }
}
