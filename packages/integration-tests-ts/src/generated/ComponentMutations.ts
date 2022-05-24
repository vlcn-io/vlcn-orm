// SIGNED-SOURCE: <921284e1636fdac8db6863cbc9aacf72>
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import Component from "./Component.js";
import { default as spec } from "./ComponentSpec.js";
import { Data } from "./Component.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";
import Slide from "./Slide.js";
import { Data as SlideData } from "./Slide.js";

class Mutations extends MutationsBase<Component, Data> {
  constructor(ctx: Context, mutator: ICreateOrUpdateBuilder<Component, Data>) {
    super(ctx, mutator);
  }

  create({
    subtype,
    slide,
    content,
  }: {
    subtype: "Text" | "Embed";
    slide: Slide | Changeset<Slide, SlideData>;
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

export default class ComponentMutations {
  static create(
    ctx: Context,
    args: {
      subtype: "Text" | "Embed";
      slide: Slide | Changeset<Slide, SlideData>;
      content: string;
    }
  ): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(spec)).create(args);
  }

  static delete(model: Component, args: {}): Mutations {
    return new Mutations(
      model.ctx,
      new DeleteMutationBuilder(spec, model)
    ).delete(args);
  }
}
