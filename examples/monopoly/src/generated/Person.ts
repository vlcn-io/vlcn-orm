// SIGNED-SOURCE: <f0e7862b8fb8920b29909247812280b9>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { default as s } from "./PersonSpec.js";
import { P } from "@aphro/runtime-ts";
import { Model } from "@aphro/runtime-ts";
import { ModelSpec } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import PersonQuery from "./PersonQuery.js";
import { Context } from "@aphro/runtime-ts";
import PlayerQuery from "./PlayerQuery.js";
import Player from "./Player.js";

export type Data = {
  id: SID_of<Person>;
  token: string;
};

export default class Person extends Model<Data> {
  readonly spec = s as ModelSpec<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  get token(): string {
    return this.data.token;
  }

  queryPlaying(): PlayerQuery {
    return PlayerQuery.create(this.ctx).whereOwnerId(P.equals(this.id));
  }

  static queryAll(ctx: Context): PersonQuery {
    return PersonQuery.create(ctx);
  }

  static async genx(ctx: Context, id: SID_of<Person>): Promise<Person> {
    const existing = ctx.cache.get(id);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(ctx: Context, id: SID_of<Person>): Promise<Person | null> {
    const existing = ctx.cache.get(id);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue();
  }
}
