// SIGNED-SOURCE: <7d0d25f25f11886b40ae35917416132c>
import { ICreateOrUpdateBuilder } from "@aphro/mutator-runtime-ts";
import { Context } from "@aphro/context-runtime-ts";
import { MutationsBase } from "@aphro/mutator-runtime-ts";
import Deck from "./Deck.js";
import { default as spec } from "./DeckSpec.js";
import { Data } from "./Deck.js";
import { UpdateMutationBuilder } from "@aphro/mutator-runtime-ts";
import { CreateMutationBuilder } from "@aphro/mutator-runtime-ts";
import { DeleteMutationBuilder } from "@aphro/mutator-runtime-ts";
import User from "./User.js";
import Slide from "./Slide.js";

export default class DeckMutations extends MutationsBase<Deck, Data> {
  private constructor(
    ctx: Context,
    mutator: ICreateOrUpdateBuilder<Deck, Data>
  ) {
    super(ctx, mutator);
  }

  static update(model: Deck) {
    return new DeckMutations(model.ctx, new UpdateMutationBuilder(spec, model));
  }

  static create(ctx: Context) {
    return new DeckMutations(ctx, new CreateMutationBuilder(spec));
  }

  static delete(model: Deck) {
    return new DeckMutations(model.ctx, new DeleteMutationBuilder(spec, model));
  }

  create({
    name,
    owner,
    selectedSlide,
  }: {
    name: string;
    owner: User;
    selectedSlide: Slide | null;
  }): this {
    // BEGIN-MANUAL-SECTION
    // END-MANUAL-SECTION
    return this;
  }

  selectSlide({ selectedSlide }: { selectedSlide: Slide }): this {
    // BEGIN-MANUAL-SECTION
    // END-MANUAL-SECTION
    return this;
  }

  rename({ name }: { name: string }): this {
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
