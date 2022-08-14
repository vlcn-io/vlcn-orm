// SIGNED-SOURCE: <783b9045ced56c1ab41346ad12af52de>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import * as impls from "../SlideMutationsImpl.js";
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import Slide from "../Slide.js";
import { default as spec } from "./SlideSpec.js";
import { Data } from "./SlideBase.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";
import Deck from "../Deck.js";
import { Data as DeckData } from "./DeckBase.js";

export type CreateArgs = {
  deck: Deck | Changeset<Deck, DeckData>;
  order: number;
};

export type ReorderArgs = { order: number };

export type DeleteArgs = {};
class Mutations extends MutationsBase<Slide, Data> {
  constructor(
    ctx: Context,
    mutator: ICreateOrUpdateBuilder<Slide, Data>,
    private model?: Slide
  ) {
    super(ctx, mutator);
  }

  create(args: CreateArgs): this {
    const extraChangesets = impls.createImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }

  reorder(args: ReorderArgs): this {
    const extraChangesets = impls.reorderImpl(this.model!, this.mutator, args);
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
  constructor(private model: Slide) {}

  reorder(args: ReorderArgs): Mutations {
    return new Mutations(
      this.model.ctx,
      new UpdateMutationBuilder(this.model.ctx, spec, this.model),
      this.model
    ).reorder(args);
  }
  delete(args: DeleteArgs): Mutations {
    return new Mutations(
      this.model.ctx,
      new DeleteMutationBuilder(this.model.ctx, spec, this.model),
      this.model
    ).delete(args);
  }
}
