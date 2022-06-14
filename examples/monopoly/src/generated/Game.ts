// SIGNED-SOURCE: <fc14c86f093ee60b2a05950ffae0386b>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { default as s } from "./GameSpec.js";
import { P } from "@aphro/runtime-ts";
import { Model } from "@aphro/runtime-ts";
import { ModelSpec } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import GameQuery from "./GameQuery.js";
import { Context } from "@aphro/runtime-ts";
import PlayerQuery from "./PlayerQuery.js";
import Player from "./Player.js";
import PropertyQuery from "./PropertyQuery.js";
import Property from "./Property.js";

export type Data = {
  id: SID_of<Game>;
  name: string;
};

export default class Game extends Model<Data> {
  readonly spec = s as ModelSpec<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  get name(): string {
    return this.data.name;
  }

  queryPlayers(): PlayerQuery {
    return PlayerQuery.create(this.ctx).whereGameId(P.equals(this.id));
  }
  queryBoard(): PropertyQuery {
    return PropertyQuery.create(this.ctx).whereGameId(P.equals(this.id));
  }

  static queryAll(ctx: Context): GameQuery {
    return GameQuery.create(ctx);
  }
}
