// SIGNED-SOURCE: <3124da960aeaf6284d021e526ca4a3a2>
import { ModelSpec } from "@aphro/model-runtime-ts";
import { default as UserSpec } from "./UserSpec.js";
import { default as SlideSpec } from "./SlideSpec.js";
import Deck from "./Deck.js";
import { Data } from "./Deck.js";

const spec: ModelSpec<Data, Deck> = {
  createFrom(data: Data) {
    return new Deck(data);
  },

  primaryKey: "id",

  storage: {
    engine: "postgres",
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
        return spec;
      },
      dest: UserSpec,
    },
    slides: {
      type: "foreignKey",
      sourceField: "id",
      destField: "deckId",
      get source() {
        return spec;
      },
      dest: SlideSpec,
    },
    selectedSlide: {
      type: "field",
      sourceField: "selectedSlideId",
      destField: "id",
      get source() {
        return spec;
      },
      dest: SlideSpec,
    },
  },
};

export default spec;
