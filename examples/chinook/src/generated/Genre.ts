// SIGNED-SOURCE: <98424fabfba9dd3bdf49cfe8fb0f570e>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { default as s } from "./GenreSpec.js";
import { P } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import GenreQuery from "./GenreQuery.js";
import { Context } from "@aphro/runtime-ts";

export type Data = {
  id: SID_of<Genre>;
  name: string | null;
};

export default class Genre extends Node<Data> {
  readonly spec = s as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  get name(): string | null {
    return this.data.name;
  }

  static queryAll(ctx: Context): GenreQuery {
    return GenreQuery.create(ctx);
  }

  static async genx(ctx: Context, id: SID_of<Genre>): Promise<Genre> {
    const existing = ctx.cache.get(id, "Genre");
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(ctx: Context, id: SID_of<Genre>): Promise<Genre | null> {
    const existing = ctx.cache.get(id, "Genre");
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue();
  }
}
