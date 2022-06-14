// SIGNED-SOURCE: <e7d30fc22b8b7607cadd85e088395b63>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { Context } from "@aphro/runtime-ts";
import { ModelSpec } from "@aphro/runtime-ts";
import { default as PropertySpec } from "./PropertySpec.js";
import { default as GameSpec } from "./GameSpec.js";
import { default as PersonSpec } from "./PersonSpec.js";
import Player from "./Player.js";
import { Data } from "./Player.js";

const spec: ModelSpec<Player, Data> = {
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"]);
    if (existing) {
      return existing;
    }
    const result = new Player(ctx, data);
    ctx.cache.set(data["id"], result);
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "monopoly",
    type: "sql",
    tablish: "player",
  },

  outboundEdges: {
    properties: {
      type: "foreignKey",
      sourceField: "id",
      destField: "ownerId",
      get source() {
        return spec;
      },
      get dest() {
        return PropertySpec;
      },
    },
    playing: {
      type: "field",
      sourceField: "gameId",
      destField: "id",
      get source() {
        return spec;
      },
      get dest() {
        return GameSpec;
      },
    },
    owner: {
      type: "field",
      sourceField: "ownerId",
      destField: "id",
      get source() {
        return spec;
      },
      get dest() {
        return PersonSpec;
      },
    },
  },
};

export default spec;
