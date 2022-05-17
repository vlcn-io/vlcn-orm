// SIGNED-SOURCE: <5cfb580ac56d1e8824cb7f2b85e4d750>
import { ICreateOrUpdateBuilder } from "@aphro/mutator-runtime-ts";
import { Context } from "@aphro/context-runtime-ts";
import { MutationsBase } from "@aphro/mutator-runtime-ts";
import Component from "./Component.js";
import { default as spec } from "./ComponentSpec.js";
import { Data } from "./Component.js";
import { UpdateMutationBuilder } from "@aphro/mutator-runtime-ts";
import { CreateMutationBuilder } from "@aphro/mutator-runtime-ts";
import { DeleteMutationBuilder } from "@aphro/mutator-runtime-ts";
import Slide from "./Slide.js";

export default class ComponentMutations extends MutationsBase<Component, Data> {
  private constructor(
    ctx: Context,
    mutator: ICreateOrUpdateBuilder<Component, Data>
  ) {
    super(ctx, mutator);
  }

  static update(model: Component) {
    return new ComponentMutations(
      model.ctx,
      new UpdateMutationBuilder(spec, model)
    );
  }

  static create(ctx: Context) {
    return new ComponentMutations(ctx, new CreateMutationBuilder(spec));
  }

  static delete(model: Component) {
    return new ComponentMutations(
      model.ctx,
      new DeleteMutationBuilder(spec, model)
    );
  }

  create(subtype: "Text" | "Embed", slide: Slide, content: string): this {
    // BEGIN-MANUAL-SECTION
    // END-MANUAL-SECTION
    return this;
  }

  delete(): this {
    // BEGIN-MANUAL-SECTION
    // END-MANUAL-SECTION
    return this;
  }
}
