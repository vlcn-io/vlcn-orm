// SIGNED-SOURCE: <f76a3095c6d8cd17142128d8d727daa6>
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import Slide from "./Slide.js";
import { default as spec } from "./SlideSpec.js";
import { Data } from "./Slide.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
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

  static creation(ctx: Context) {
    return new SlideMutations(ctx, new CreateMutationBuilder(spec));
  }

  static deletion(model: Slide) {
    return new SlideMutations(
      model.ctx,
      new DeleteMutationBuilder(spec, model)
    );
  }

  create({ deck, order }: { deck: Deck; order: number }): this {
    // BEGIN-MANUAL-SECTION
    // END-MANUAL-SECTION
    return this;
  }

  reorder({ order }: { order: number }): this {
    // BEGIN-MANUAL-SECTION
    // END-MANUAL-SECTION
    return this;
  }

  delete({}: {}): this {
    // BEGIN-MANUAL-SECTION
    // END-MANUAL-SECTION
    return this;
  }
}
