// SIGNED-SOURCE: <8e050fe60e20d7075f0190934b53d216>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import * as impls from "../DeckMutationsImpl.js";
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import Deck from "../Deck.js";
import { default as spec } from "./DeckSpec.js";
import { Data } from "./DeckBase.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";
import User from "../User.js";
import { Data as UserData } from "./UserBase.js";
import Slide from "../Slide.js";
import { Data as SlideData } from "./SlideBase.js";

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
  constructor(
    ctx: Context,
    mutator: ICreateOrUpdateBuilder<Deck, Data>,
    private model?: Deck
  ) {
    super(ctx, mutator);
  }

  create(args: CreateArgs): this {
    const extraChangesets = impls.createImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }

  selectSlide(args: SelectSlideArgs): this {
    const extraChangesets = impls.selectSlideImpl(
      this.model!,
      this.mutator,
      args
    );
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }

  rename(args: RenameArgs): this {
    const extraChangesets = impls.renameImpl(this.model!, this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }

  delete(args: DeleteArgs): this {
    const extraChangesets = impls.deleteImpl(this.model!, this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }
}

const staticMutations = {
  create(ctx: Context, args: CreateArgs): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(ctx, spec)).create(
      args
    );
  },
};

export default staticMutations;

export class InstancedMutations {
  constructor(private model: Deck) {}

  selectSlide(args: SelectSlideArgs): Mutations {
    return new Mutations(
      this.model.ctx,
      new UpdateMutationBuilder(this.model.ctx, spec, this.model),
      this.model
    ).selectSlide(args);
  }

  rename(args: RenameArgs): Mutations {
    return new Mutations(
      this.model.ctx,
      new UpdateMutationBuilder(this.model.ctx, spec, this.model),
      this.model
    ).rename(args);
  }
  delete(args: DeleteArgs): Mutations {
    return new Mutations(
      this.model.ctx,
      new DeleteMutationBuilder(this.model.ctx, spec, this.model),
      this.model
    ).delete(args);
  }
}
