// SIGNED-SOURCE: <5ef059f446155c19aaa9df00be028f07>
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
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import GenreQuery from "./GenreQuery.js";
import { Context } from "@aphro/runtime-ts";
import TrackQuery from "./TrackQuery.js";
import Track from "../Track.js";

export type Data = {
  id: SID_of<Genre>;
  name: string | null;
};

// @Sealed(Genre)
export default abstract class GenreBase extends Node<Data> {
  readonly spec = s as unknown as NodeSpecWithCreate<this, Data>;

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

  static async genx(ctx: Context, id: SID_of<Genre>): Promise<Genre> {
    const existing = ctx.cache.get(id, "chinook", "genre");
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(ctx: Context, id: SID_of<Genre>): Promise<Genre | null> {
    const existing = ctx.cache.get(id, "chinook", "genre");
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue();
  }

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
