// SIGNED-SOURCE: <bc9c6f2ef9c042f33ad3cb508c4a96ce>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as UserSpec } from "./UserSpec.js";
import { default as SlideSpec } from "./SlideSpec.js";
import Deck from "./Deck.js";
import { Data } from "./Deck.js";

const spec: NodeSpecWithCreate<Deck, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], Deck.name);
    if (existing) {
      return existing;
    }
    const result = new Deck(ctx, data);
    ctx.cache.set(data["id"], result);
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "memory",
    db: "none",
    type: "memory",
    tablish: "deck",
  },

  outboundEdges: {
    owner: {
      type: "field",
      sourceField: "ownerId",
      destField: "id",
      get source() {
        return spec;
      },
      get dest() {
        return UserSpec;
      },
    },
    slides: {
      type: "foreignKey",
      sourceField: "id",
      destField: "deckId",
      get source() {
        return spec;
      },
      get dest() {
        return SlideSpec;
      },
    },
    selectedSlide: {
      type: "field",
      sourceField: "selectedSlideId",
      destField: "id",
      get source() {
        return spec;
      },
      get dest() {
        return SlideSpec;
      },
    },
    editors: {
      type: "junction",
      storage: {
        type: "memory",
        engine: "memory",
        db: "none",
        tablish: "decktoeditorsedge",
      },
      sourceField: "id",
      destField: "id",
      get source() {
        return spec;
      },
      get dest() {
        return UserSpec;
      },
    },
  },
};

export default spec;
