// SIGNED-SOURCE: <d103d6cf77e0fd766fe66cd9c10dd316>
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
  constructor(ctx: Context, mutator: ICreateOrUpdateBuilder<Component, Data>) {
    super(ctx, mutator);
  }

  create(args: CreateArgs): this {
    const extraChangesets = impls.createImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }

  delete(args: DeleteArgs): this {
    const extraChangesets = impls.deleteImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }
}

export default class ComponentMutations {
  static create(ctx: Context, args: CreateArgs): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(ctx, spec)).create(
      args
    );
  }

  static delete(model: Component, args: DeleteArgs): Mutations {
    return new Mutations(
      model.ctx,
      new DeleteMutationBuilder(model.ctx, spec, model)
    ).delete(args);
  }
}
