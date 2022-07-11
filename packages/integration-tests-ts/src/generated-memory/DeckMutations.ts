// SIGNED-SOURCE: <203f97701c7216617fe4b4e3ba095394>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import * as impls from "./DeckMutationsImpl.js";
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import Deck from "./Deck.js";
import { default as spec } from "./DeckSpec.js";
import { Data } from "./Deck.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";
import User from "./User.js";
import { Data as UserData } from "./User.js";
import Slide from "./Slide.js";
import { Data as SlideData } from "./Slide.js";

export type CreateArgs = {
  name: string;
  owner: User | Changeset<User, UserData>;
  selectedSlide: Slide | Changeset<Slide, SlideData> | null;
};

export type SelectSlideArgs = {
  selectedSlide: Slide | Changeset<Slide, SlideData>;
};

export type RenameArgs = { name: string };

export type DeleteArgs = {};
class Mutations extends MutationsBase<Deck, Data> {
  constructor(ctx: Context, mutator: ICreateOrUpdateBuilder<Deck, Data>) {
    super(ctx, mutator);
  }

  create(args: CreateArgs): this {
    const extraChangesets = impls.createImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }

  selectSlide(args: SelectSlideArgs): this {
    const extraChangesets = impls.selectSlideImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }

  rename(args: RenameArgs): this {
    const extraChangesets = impls.renameImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }

  delete(args: DeleteArgs): this {
    const extraChangesets = impls.deleteImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }
}

export default class DeckMutations {
  static create(ctx: Context, args: CreateArgs): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(spec)).create(args);
  }
  static selectSlide(model: Deck, args: SelectSlideArgs): Mutations {
    return new Mutations(
      model.ctx,
      new UpdateMutationBuilder(spec, model)
    ).selectSlide(args);
  }

  static rename(model: Deck, args: RenameArgs): Mutations {
    return new Mutations(
      model.ctx,
      new UpdateMutationBuilder(spec, model)
    ).rename(args);
  }
  static delete(model: Deck, args: DeleteArgs): Mutations {
    return new Mutations(
      model.ctx,
      new DeleteMutationBuilder(spec, model)
    ).delete(args);
  }
}
