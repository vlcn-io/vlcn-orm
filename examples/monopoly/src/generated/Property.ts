// SIGNED-SOURCE: <c1fd6d45757ed4bdb0240a02ba9f621d>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { default as s } from "./PropertySpec.js";
import { P } from "@aphro/runtime-ts";
import { Model } from "@aphro/runtime-ts";
import { ModelSpec } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import PropertyQuery from "./PropertyQuery.js";
import { Context } from "@aphro/runtime-ts";
import PlayerQuery from "./PlayerQuery.js";
import Player from "./Player.js";
import Game from "./Game.js";

export type Data = {
  id: SID_of<Property>;
  name: string;
  ownerId: SID_of<Player> | null;
  gameId: SID_of<Game>;
  cost: number;
  mortgaged: boolean;
  numHouses: number;
  numHotels: number;
};

export default class Property extends Model<Data> {
  readonly spec = s as ModelSpec<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  get name(): string {
    return this.data.name;
  }

  get ownerId(): SID_of<Player> | null {
    return this.data.ownerId;
  }

  get gameId(): SID_of<Game> {
    return this.data.gameId;
  }

  get cost(): number {
    return this.data.cost;
  }

  get mortgaged(): boolean {
    return this.data.mortgaged;
  }

  get numHouses(): number {
    return this.data.numHouses;
  }

  get numHotels(): number {
    return this.data.numHotels;
  }

  queryOwner(): PlayerQuery {
    return PlayerQuery.fromId(this.ctx, this.ownerId);
  }

  static queryAll(ctx: Context): PropertyQuery {
    return PropertyQuery.create(ctx);
  }

  static async genx(ctx: Context, id: SID_of<Property>): Promise<Property> {
    const existing = ctx.cache.get(id);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(
    ctx: Context,
    id: SID_of<Property>
  ): Promise<Property | null> {
    const existing = ctx.cache.get(id);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue();
  }
}
