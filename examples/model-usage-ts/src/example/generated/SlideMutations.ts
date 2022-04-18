// SIGNED-SOURCE: <5963b74a42d24f481ae0fb7a7580b9d4>
import { ICreateOrUpdateBuilder } from "@aphro/mutator-runtime-ts";
import Slide from "./Slide.js";
import { default as spec } from "./SlideSpec.js";
import { Data } from "./Slide.js";
import { UpdateMutationBuilder } from "@aphro/mutator-runtime-ts";
import { CreateMutationBuilder } from "@aphro/mutator-runtime-ts";
import Deck from "./Deck.js";

export default class SlideMutations {
  constructor(private mutator: ICreateOrUpdateBuilder<Data, Slide>) {}

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
