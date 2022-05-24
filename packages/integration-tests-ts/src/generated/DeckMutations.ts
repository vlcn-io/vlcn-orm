// SIGNED-SOURCE: <4eecf21ae8a252a6c3e2672af2c2d6cd>
import { ICreateOrUpdateBuilder, sid } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import Deck from "./Deck.js";
import { default as spec } from "./DeckSpec.js";
import { Data } from "./Deck.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";
import User from "./User.js";
import { Data as UserData } from "./User.js";
import Slide from "./Slide.js";
import { Data as SlideData } from "./Slide.js";

// BEGIN-MANUAL-SECTION
// Manual section for any new imports / export / top level things
// END-MANUAL-SECTION

class Mutations extends MutationsBase<Deck, Data> {
  constructor(ctx: Context, mutator: ICreateOrUpdateBuilder<Deck, Data>) {
    super(ctx, mutator);
  }

  create({
    name,
    owner,
    selectedSlide,
  }: {
    name: string;
    owner: User | Changeset<User, UserData>;
    selectedSlide: Slide | Changeset<Slide, SlideData> | null;
  }): this {
    // BEGIN-MANUAL-SECTION
    this.mutator.set({
      id: sid('test'),
      name,
      ownerId: owner.id,
      selectedSlideId: selectedSlide?.id,
    });
    // END-MANUAL-SECTION
    return this;
  }

  selectSlide({
    selectedSlide,
  }: {
    selectedSlide: Slide | Changeset<Slide, SlideData>;
  }): this {
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

export default class DeckMutations {
  static create(
    ctx: Context,
    args: {
      name: string;
      owner: User | Changeset<User, UserData>;
      selectedSlide: Slide | Changeset<Slide, SlideData> | null;
    }
  ): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(spec)).create(args);
  }
  static selectSlide(
    model: Deck,
    args: { selectedSlide: Slide | Changeset<Slide, SlideData> }
  ): Mutations {
    return new Mutations(
      model.ctx,
      new UpdateMutationBuilder(spec, model)
    ).selectSlide(args);
  }

  static rename(model: Deck, args: { name: string }): Mutations {
    return new Mutations(
      model.ctx,
      new UpdateMutationBuilder(spec, model)
    ).rename(args);
  }
  static delete(model: Deck, args: {}): Mutations {
    return new Mutations(
      model.ctx,
      new DeleteMutationBuilder(spec, model)
    ).delete(args);
  }
}
