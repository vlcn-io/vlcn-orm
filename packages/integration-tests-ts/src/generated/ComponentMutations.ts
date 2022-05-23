// SIGNED-SOURCE: <329e9df8fbf3132ae2d1495facce84c3>
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import Component from "./Component.js";
import { default as spec } from "./ComponentSpec.js";
import { Data } from "./Component.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
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

  static creation(ctx: Context) {
    return new ComponentMutations(ctx, new CreateMutationBuilder(spec));
  }

  static deletion(model: Component) {
    return new ComponentMutations(
      model.ctx,
      new DeleteMutationBuilder(spec, model)
    );
  }

  create({
    subtype,
    slide,
    content,
  }: {
    subtype: "Text" | "Embed";
    slide: Slide;
    content: string;
  }): this {
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
