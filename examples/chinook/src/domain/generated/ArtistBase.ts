// SIGNED-SOURCE: <9f316625d2409919e068865b0d216aa2>
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
import { modelGenMemo } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import ArtistQuery from "./ArtistQuery.js";
import { Context } from "@aphro/runtime-ts";
import albumQuery from "./albumQuery.js";
import album from "../album.js";

export type Data = {
  id: SID_of<Artist>;
  name: string | null;
};

// @Sealed(Artist)
export default abstract class ArtistBase extends Node<Data> {
  readonly spec = s as unknown as NodeSpecWithCreate<this, Data>;

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

  static gen = modelGenMemo(
    "chinook",
    "artist",
    (ctx: Context, id: SID_of<Artist>): Promise<Artist | null> =>
      this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue()
  );

  update(data: Partial<Data>) {
    return new UpdateMutationBuilder(this.ctx, this.spec, this)
      .set(data)
      .toChangeset();
  }

  static create(ctx: Context, data: Partial<Data>) {
    return new CreateMutationBuilder(ctx, s).set(data).toChangeset();
  }

  delete() {
    return new DeleteMutationBuilder(this.ctx, this.spec, this).toChangeset();
  }
}
