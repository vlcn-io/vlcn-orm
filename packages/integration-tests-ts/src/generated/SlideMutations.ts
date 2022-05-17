// SIGNED-SOURCE: <f35b443976bc9dcd0a583a415f63bbc4>
import { ICreateOrUpdateBuilder } from "@aphro/mutator-runtime-ts";
import { Context } from "@aphro/context-runtime-ts";
import { MutationsBase } from "@aphro/mutator-runtime-ts";
import Slide from "./Slide.js";
import { default as spec } from "./SlideSpec.js";
import { Data } from "./Slide.js";
import { UpdateMutationBuilder } from "@aphro/mutator-runtime-ts";
import { CreateMutationBuilder } from "@aphro/mutator-runtime-ts";
import { DeleteMutationBuilder } from "@aphro/mutator-runtime-ts";
import Deck from "./Deck.js";

export default class SlideMutations extends MutationsBase<Slide, Data> {
  private constructor(
    ctx: Context,
    mutator: ICreateOrUpdateBuilder<Slide, Data>
  ) {
    super(ctx, mutator);
  }

  static update(model: Slide) {
    return new SlideMutations(
      model.ctx,
      new UpdateMutationBuilder(spec, model)
    );
  }

  static create(ctx: Context) {
    return new SlideMutations(ctx, new CreateMutationBuilder(spec));
  }

  static delete(model: Slide) {
    return new SlideMutations(
      model.ctx,
      new DeleteMutationBuilder(spec, model)
    );
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
