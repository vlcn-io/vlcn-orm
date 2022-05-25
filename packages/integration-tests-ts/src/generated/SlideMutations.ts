// SIGNED-SOURCE: <a190943b051d294414b6c6805ecb0b13>
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

// BEGIN-MANUAL-SECTION: [module-level]
import {sid} from '@aphro/runtime-ts';
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
    // BEGIN-MANUAL-SECTION: [create]
    this.mutator.set({
      id: sid('test'),
      order,
      deckId: deck.id,
    })
    // END-MANUAL-SECTION
    return this;
  }

  reorder({ order }: { order: number }): this {
    // BEGIN-MANUAL-SECTION: [reorder]
    throw new Error("Mutation reorder is not implemented!");
    // END-MANUAL-SECTION
    return this;
  }

  delete({}: {}): this {
    // BEGIN-MANUAL-SECTION: [delete]
    throw new Error("Mutation delete is not implemented!");
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
