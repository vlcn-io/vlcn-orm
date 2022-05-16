// SIGNED-SOURCE: <2d675ae3a2673b61e5e1c372771b4633>
import { ICreateOrUpdateBuilder } from "@aphro/mutator-runtime-ts";
import Slide from "./Slide.js";
import { default as spec } from "./SlideSpec.js";
import { Data } from "./Slide.js";
import { UpdateMutationBuilder } from "@aphro/mutator-runtime-ts";
import { CreateMutationBuilder } from "@aphro/mutator-runtime-ts";
import Deck from "./Deck.js";

export default class SlideMutations {
  constructor(private mutator: ICreateOrUpdateBuilder<Slide, Data>) {}

  static for(model?: Slide) {
    if (model) {
      return new SlideMutations(new UpdateMutationBuilder(spec, model));
    }
    return new SlideMutations(new CreateMutationBuilder(spec));
  }

  create(deck: Deck, order: number): this {
    // BEGIN-MANUAL-SECTION
    // END-MANUAL-SECTION
    return this;
  }

  reorder(order: number): this {
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
