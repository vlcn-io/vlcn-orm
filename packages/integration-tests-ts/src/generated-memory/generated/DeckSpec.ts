// SIGNED-SOURCE: <e873cc7f6a5187529c81cb867a9f1053>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as UserSpec } from "./UserSpec.js";
import { default as SlideSpec } from "./SlideSpec.js";
import Deck from "../Deck.js";
import { Data } from "./DeckBase.js";

const DeckSpec: NodeSpecWithCreate<Deck, Data> = {
  type: "node",
  createFrom(ctx: Context, rawData: Data) {
    const existing = ctx.cache.get(rawData["id"], "none", "deck");
    if (existing) {
      return existing;
    }
    const result = new Deck(ctx, rawData);
    ctx.cache.set(rawData["id"], result, "none", "deck");
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "memory",
    db: "none",
    type: "memory",
    tablish: "deck",
  },

  fields: {
    id: {
      encoding: "none",
    },
    name: {
      encoding: "none",
    },
    created: {
      encoding: "none",
    },
    modified: {
      encoding: "none",
    },
    ownerId: {
      encoding: "none",
    },
    selectedSlideId: {
      encoding: "none",
    },
  },
  outboundEdges: {
    owner: {
      type: "field",
      sourceField: "ownerId",
      destField: "id",
      get source() {
        return DeckSpec;
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
        return DeckSpec;
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
        return DeckSpec;
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
      fields: {},
      sourceField: "id",
      destField: "id",
      get source() {
        return DeckSpec;
      },
      get dest() {
        return UserSpec;
      },
    },
  },
};

export default DeckSpec;
