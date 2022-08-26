// SIGNED-SOURCE: <f2fefc2187658a44a80fcd678a86e296>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { decodeModelData } from "@aphro/runtime-ts";
import { encodeModelData } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as UserSpec } from "./UserSpec.js";
import { default as SlideSpec } from "./SlideSpec.js";
import Deck from "../Deck.js";
import { Data } from "./DeckBase.js";

const fields = {
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
} as const;
const DeckSpec: NodeSpecWithCreate<Deck, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data, raw: boolean = true) {
    const existing = ctx.cache.get(data["id"], "example", "deck");
    if (existing) {
      return existing;
    }
    if (raw) data = decodeModelData(data, fields);
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

  fields,

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
