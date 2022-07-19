// SIGNED-SOURCE: <add14791ee1d97da3c1bb31004f29353>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import MediaType from "../MediaType.js";
import { default as s } from "./MediaTypeSpec.js";
import { P } from "@aphro/runtime-ts";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import MediaTypeQuery from "./MediaTypeQuery.js";
import { Context } from "@aphro/runtime-ts";

export type Data = {
  id: SID_of<MediaType>;
  name: string;
};

// @Sealed(MediaType)
export default abstract class MediaTypeBase extends Node<Data> {
  readonly spec = s as unknown as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as unknown as SID_of<this>;
  }

  get name(): string {
    return this.data.name;
  }

  static queryAll(ctx: Context): MediaTypeQuery {
    return MediaTypeQuery.create(ctx);
  }

  static async genx(ctx: Context, id: SID_of<MediaType>): Promise<MediaType> {
    const existing = ctx.cache.get(id, "chinook", "mediatype");
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(
    ctx: Context,
    id: SID_of<MediaType>
  ): Promise<MediaType | null> {
    const existing = ctx.cache.get(id, "chinook", "mediatype");
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
