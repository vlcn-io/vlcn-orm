// SIGNED-SOURCE: <4f6075669d2aa4edbe40dacfd442afb6>
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import Deck from "./Deck.js";
import { default as spec } from "./DeckSpec.js";
import { Data } from "./Deck.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
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
