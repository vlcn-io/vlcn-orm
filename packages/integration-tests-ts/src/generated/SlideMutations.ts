// SIGNED-SOURCE: <7fdb7e5aac92110775e549ef989f223f>
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import Slide from "./Slide.js";
import { default as spec } from "./SlideSpec.js";
import { Data } from "./Slide.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";
import Deck from "./Deck.js";
import { Data as DeckData } from "./Deck.js";

// BEGIN-MANUAL-SECTION
// Manual section for any new imports / export / top level things
// END-MANUAL-SECTION

class Mutations extends MutationsBase<Slide, Data> {
  constructor(ctx: Context, mutator: ICreateOrUpdateBuilder<Slide, Data>) {
    super(ctx, mutator);
  }

  create({
    deck,
    order,
  }: {
    deck: Deck | Changeset<Deck, DeckData>;
    order: number;
  }): this {
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

export default class SlideMutations {
  static create(
    ctx: Context,
    args: { deck: Deck | Changeset<Deck, DeckData>; order: number }
  ): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(spec)).create(args);
  }
  static reorder(model: Slide, args: { order: number }): Mutations {
    return new Mutations(
      model.ctx,
      new UpdateMutationBuilder(spec, model)
    ).reorder(args);
  }
  static delete(model: Slide, args: {}): Mutations {
    return new Mutations(
      model.ctx,
      new DeleteMutationBuilder(spec, model)
    ).delete(args);
  }
}
