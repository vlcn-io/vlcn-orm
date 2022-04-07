// SIGNED-SOURCE: <2236fed9134b9bbfb85cfd803153aa98>
import { ModelSpec } from "@aphro/model-runtime-ts";
import { default as UserSpec } from "./UserSpec.js";
import { default as SlideSpec } from "./SlideSpec.js";
import Deck from "./Deck.js";
import { Data } from "./Deck.js";
import { default as DeckSpec } from "./DeckSpec.js";

const spec: ModelSpec<Data> = {
  createFrom(data: Data) {
    return new Deck(data);
  },

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
      source: DeckSpec,
      dest: UserSpec,
    },
    slides: {
      type: "foreignKey",
      sourceField: "id",
      destField: "deckId",
      source: DeckSpec,
      dest: SlideSpec,
    },
  },
};

export default spec;
