// SIGNED-SOURCE: <dc573a6db138dadb30d2bae305f40d7d>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import * as impls from "../ComponentMutationsImpl.js";
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import Component from "../Component.js";
import { default as spec } from "./ComponentSpec.js";
import { Data } from "./ComponentBase.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";
import Slide from "../Slide.js";
import { Data as SlideData } from "./SlideBase.js";

export type CreateArgs = {
  subtype: "Text" | "Embed";
  slide: Slide | Changeset<Slide, SlideData>;
  content: string;
};

export type DeleteArgs = {};
class Mutations extends MutationsBase<Component, Data> {
  constructor(
    ctx: Context,
    mutator: ICreateOrUpdateBuilder<Component, Data>,
    private model?: Component
  ) {
    super(ctx, mutator);
  }

  create(args: CreateArgs): this {
    const extraChangesets = impls.createImpl(this.mutator, args);
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
  constructor(private model: Component) {}

  delete(args: DeleteArgs): Mutations {
    return new Mutations(
      this.model.ctx,
      new DeleteMutationBuilder(this.model.ctx, spec, this.model),
      this.model
    ).delete(args);
  }
}
