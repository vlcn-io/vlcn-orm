// SIGNED-SOURCE: <decd0255b5f8dc121c85c48e3e07a591>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { applyMixins } from "@aphro/runtime-ts";
import { default as s } from "./MediaTypeSpec.js";
import { P } from "@aphro/runtime-ts";
import { ManualMethods, manualMethods } from "./MediaTypeManualMethods.js";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import MediaTypeQuery from "./MediaTypeQuery.js";
import { Context } from "@aphro/runtime-ts";

export type Data = {
  id: SID_of<MediaType>;
  name: string;
};

class MediaType extends Node<Data> {
  readonly spec = s as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  get name(): string {
    return this.data.name;
  }

  static queryAll(ctx: Context): MediaTypeQuery {
    return MediaTypeQuery.create(ctx);
  }

  static async genx(ctx: Context, id: SID_of<MediaType>): Promise<MediaType> {
    const existing = ctx.cache.get(id, MediaType.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(
    ctx: Context,
    id: SID_of<MediaType>
  ): Promise<MediaType | null> {
    const existing = ctx.cache.get(id, MediaType.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue();
  }
}

interface MediaType extends ManualMethods {}
applyMixins(MediaType, [manualMethods]);
export default MediaType;
