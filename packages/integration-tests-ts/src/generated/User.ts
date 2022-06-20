// SIGNED-SOURCE: <383973995d3d9112440fe6413d1c1679>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { default as s } from "./UserSpec.js";
import { P } from "@aphro/runtime-ts";
import { Model } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import UserQuery from "./UserQuery.js";
import { Context } from "@aphro/runtime-ts";
import DeckQuery from "./DeckQuery.js";
import Deck from "./Deck.js";

export type Data = {
  id: SID_of<User>;
  name: string;
  created: number;
  modified: number;
};

export default class User extends Model<Data> {
  readonly spec = s as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  get name(): string {
    return this.data.name;
  }

  get created(): number {
    return this.data.created;
  }

  get modified(): number {
    return this.data.modified;
  }

  queryDecks(): DeckQuery {
    return DeckQuery.create(this.ctx).whereOwnerId(P.equals(this.id));
  }

  static queryAll(ctx: Context): UserQuery {
    return UserQuery.create(ctx);
  }

  static async genx(ctx: Context, id: SID_of<User>): Promise<User> {
    const existing = ctx.cache.get(id);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(ctx: Context, id: SID_of<User>): Promise<User | null> {
    const existing = ctx.cache.get(id);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue();
  }
}
