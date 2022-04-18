// SIGNED-SOURCE: <fe54df2d6194fed44ddce25ea478c8d5>
import { ICreateOrUpdateBuilder } from "@aphro/mutator-runtime-ts";
import Deck from "./Deck.js";
import { default as spec } from "./DeckSpec.js";
import { Data } from "./Deck.js";
import { UpdateMutationBuilder } from "@aphro/mutator-runtime-ts";
import { CreateMutationBuilder } from "@aphro/mutator-runtime-ts";
import User from "./User.js";
import Slide from "./Slide.js";

export default class DeckMutations {
  constructor(private mutator: ICreateOrUpdateBuilder<Data, Deck>) {}

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
