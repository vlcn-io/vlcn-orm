// SIGNED-SOURCE: <62557d040673cefb51ed62349c2535b1>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { Context } from "@aphro/runtime-ts";
import { ModelSpec } from "@aphro/runtime-ts";
import { default as PlayerSpec } from "./PlayerSpec.js";
import { default as PropertySpec } from "./PropertySpec.js";
import Game from "./Game.js";
import { Data } from "./Game.js";

const spec: ModelSpec<Game, Data> = {
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"]);
    if (existing) {
      return existing;
    }
    const result = new Game(ctx, data);
    ctx.cache.set(data["id"], result);
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "monopoly",
    type: "sql",
    tablish: "game",
  },

  outboundEdges: {
    players: {
      type: "foreignKey",
      sourceField: "id",
      destField: "gameId",
      get source() {
        return spec;
      },
      get dest() {
        return PlayerSpec;
      },
    },
    board: {
      type: "foreignKey",
      sourceField: "id",
      destField: "gameId",
      get source() {
        return spec;
      },
      get dest() {
        return PropertySpec;
      },
    },
  },
};

export default spec;
