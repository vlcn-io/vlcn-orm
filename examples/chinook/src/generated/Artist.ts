// SIGNED-SOURCE: <f75fe4f3fcbbbf41939b7941725781bf>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { applyMixins } from "@aphro/runtime-ts";
import { default as s } from "./ArtistSpec.js";
import { P } from "@aphro/runtime-ts";
import { ManualMethods, manualMethods } from "./ArtistManualMethods.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import ArtistQuery from "./ArtistQuery.js";
import { Context } from "@aphro/runtime-ts";
import albumQuery from "./albumQuery.js";
import album from "./album.js";

export type Data = {
  id: SID_of<Artist>;
  name: string | null;
};

class Artist extends Node<Data> {
  readonly spec = s as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  get name(): string | null {
    return this.data.name;
  }

  queryAlbums(): albumQuery {
    return albumQuery.create(this.ctx).whereArtistId(P.equals(this.id));
  }

  static queryAll(ctx: Context): ArtistQuery {
    return ArtistQuery.create(ctx);
  }

  static async genx(ctx: Context, id: SID_of<Artist>): Promise<Artist> {
    const existing = ctx.cache.get(id, Artist.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(ctx: Context, id: SID_of<Artist>): Promise<Artist | null> {
    const existing = ctx.cache.get(id, Artist.name);
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
    return new DeleteMutationBuilder(this.ctx, s, this).toChangeset();
  }
}

interface Artist extends ManualMethods {}
applyMixins(Artist, [manualMethods]);
export default Artist;
