// SIGNED-SOURCE: <261bd657c0e7d34e27764cd2ac4cd32b>
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
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], "example", "deck");
    if (existing) {
      return existing;
    }
    const result = new Deck(ctx, data);
    ctx.cache.set(data["id"], result, "example", "deck");
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "example",
    type: "sql",
    tablish: "deck",
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
        type: "sql",
        engine: "sqlite",
        db: "example",
        tablish: "decktoeditorsedge",
      },
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
