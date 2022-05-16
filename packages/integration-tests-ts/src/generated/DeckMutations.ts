// SIGNED-SOURCE: <55f3bde1cccb173b79f70aa8420420d4>
import { ICreateOrUpdateBuilder } from "@aphro/mutator-runtime-ts";
import Deck from "./Deck.js";
import { default as spec } from "./DeckSpec.js";
import { Data } from "./Deck.js";
import { UpdateMutationBuilder } from "@aphro/mutator-runtime-ts";
import { CreateMutationBuilder } from "@aphro/mutator-runtime-ts";
import User from "./User.js";
import Slide from "./Slide.js";

export default class DeckMutations {
  constructor(private mutator: ICreateOrUpdateBuilder<Deck, Data>) {}

  static for(model?: Deck) {
    if (model) {
      return new DeckMutations(new UpdateMutationBuilder(spec, model));
    }
    return new DeckMutations(new CreateMutationBuilder(spec));
  }

  create(name: string, owner: User, selectedSlide: Slide | null): this {
    // BEGIN-MANUAL-SECTION
    // END-MANUAL-SECTION
    return this;
  }

  selectSlide(selectedSlide: Slide): this {
    // BEGIN-MANUAL-SECTION
    // END-MANUAL-SECTION
    return this;
  }

  rename(name: string): this {
    // BEGIN-MANUAL-SECTION
    // END-MANUAL-SECTION
    return this;
  }

  delete(): this {
    // BEGIN-MANUAL-SECTION
    // END-MANUAL-SECTION
    return this;
  }
}
