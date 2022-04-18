// SIGNED-SOURCE: <434b8f2a0560c092869532bed0c9138e>
import { ICreateOrUpdateBuilder } from "@aphro/mutator-runtime-ts";
import Component from "./Component.js";
import { default as spec } from "./ComponentSpec.js";
import { Data } from "./Component.js";
import { UpdateMutationBuilder } from "@aphro/mutator-runtime-ts";
import { CreateMutationBuilder } from "@aphro/mutator-runtime-ts";
import Slide from "./Slide.js";

export default class ComponentMutations {
  constructor(private mutator: ICreateOrUpdateBuilder<Data, Component>) {}

  static for(model?: Component) {
    if (model) {
      return new ComponentMutations(new UpdateMutationBuilder(spec, model));
    }
    return new ComponentMutations(new CreateMutationBuilder(spec));
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
