// SIGNED-SOURCE: <f4d7fd801369fbb3cc0610d4519ec155>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { default as s } from "./PlayerSpec.js";
import { P } from "@aphro/runtime-ts";
import { Model } from "@aphro/runtime-ts";
import { ModelSpec } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import PlayerQuery from "./PlayerQuery.js";
import { Context } from "@aphro/runtime-ts";
import PropertyQuery from "./PropertyQuery.js";
import Property from "./Property.js";
import GameQuery from "./GameQuery.js";
import Person from "./Person.js";
import Game from "./Game.js";

export type Data = {
  id: SID_of<Player>;
  piece: string;
  ownerId: SID_of<Person>;
  gameId: SID_of<Game>;
};

export default class Player extends Model<Data> {
  readonly spec = s as ModelSpec<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  get piece(): string {
    return this.data.piece;
  }

  get ownerId(): SID_of<Person> {
    return this.data.ownerId;
  }

  get gameId(): SID_of<Game> {
    return this.data.gameId;
  }

  queryProperties(): PropertyQuery {
    return PropertyQuery.create(this.ctx).whereOwnerId(P.equals(this.id));
  }
  queryPlaying(): GameQuery {
    return GameQuery.fromId(this.ctx, this.gameId);
  }

  static queryAll(ctx: Context): PlayerQuery {
    return PlayerQuery.create(ctx);
  }
}
